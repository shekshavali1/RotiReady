from flask import Blueprint, request, jsonify
from config import get_connection
from datetime import datetime, date, time, timedelta
import uuid

order_bp = Blueprint("order", __name__)


# ==========================================
# PLACE ORDER
# ==========================================

@order_bp.route("/api/order", methods=["POST"])
def place_order():

    connection = None
    cursor = None

    try:

        data = request.get_json()

        print("Received Data:", data)

        # -----------------------------
        # Validate required fields
        # -----------------------------

        required_fields = [
            "customer_name",
            "mobile",
            "item_name",
            "quantity",
            "total_amount",
            "pickup_date",
            "pickup_time"
        ]

        for field in required_fields:

            if not data.get(field):

                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        # -----------------------------
        # Generate unique Order ID
        # -----------------------------

        order_id = "SSV" + uuid.uuid4().hex[:8].upper()

        connection = get_connection()
        cursor = connection.cursor()

        # -----------------------------
        # Amount calculation
        # -----------------------------

        total = float(data["total_amount"])

        advance = total / 2

        remaining = total - advance

        # -----------------------------
        # Insert Order
        # -----------------------------

        cursor.execute("""
            INSERT INTO orders
            (
                order_id,
                customer_name,
                mobile,
                item_name,
                quantity,
                total_amount,
                advance_amount,
                remaining_amount,
                pickup_date,
                pickup_time,
                instructions,
                payment_status,
                order_status
            )
            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s
            )
        """,
        (
            order_id,
            data["customer_name"],
            data["mobile"],
            data["item_name"],
            data["quantity"],
            total,
            advance,
            remaining,
            data["pickup_date"],
            data["pickup_time"],
            data.get("instructions", ""),
            "Pending",
            "Pending"
        ))

        connection.commit()

        database_id = cursor.lastrowid

        print("Created Order:", order_id)

        return jsonify({

            "success": True,

            "order_id": database_id,

            "order_code": order_id,

            "message": "Order Created Successfully"

        })

    except Exception as e:

        if connection:
            connection.rollback()

        import traceback
        traceback.print_exc()

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==========================================
# GET ALL ORDERS - ADMIN
# ==========================================

@order_bp.route("/api/orders", methods=["GET"])
def get_orders():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM orders
            ORDER BY id DESC
        """)

        orders = cursor.fetchall()

        # Convert MySQL date/time objects
        for order in orders:

            for key, value in order.items():

                if isinstance(value, timedelta):

                    order[key] = str(value)

                elif isinstance(value, (datetime, date, time)):

                    order[key] = value.isoformat()

                elif value is None:

                    order[key] = ""

        return jsonify({

            "success": True,

            "orders": orders

        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==========================================
# UPDATE ORDER STATUS
# ==========================================

@order_bp.route("/api/orders/<int:id>", methods=["PUT"])
def update_status(id):

    connection = None
    cursor = None

    try:

        data = request.get_json()

        status = data.get("order_status")

        if not status:

            return jsonify({

                "success": False,

                "message": "Order status is required"

            }), 400

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE orders
            SET order_status=%s
            WHERE id=%s
        """, (status, id))

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({

                "success": False,

                "message": "Order not found"

            }), 404

        return jsonify({

            "success": True,

            "message": "Status Updated Successfully"

        })

    except Exception as e:

        if connection:
            connection.rollback()

        import traceback
        traceback.print_exc()

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==========================================
# TRACK ORDER
# ==========================================

@order_bp.route("/api/track/<int:id>", methods=["GET"])
def track_order(id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM orders
            WHERE id=%s
        """, (id,))

        order = cursor.fetchone()

        if not order:

            return jsonify({

                "success": False,

                "message": "Order Not Found"

            }), 404

        for key, value in order.items():

            if isinstance(value, timedelta):

                order[key] = str(value)

            elif isinstance(value, (datetime, date, time)):

                order[key] = value.isoformat()

            elif value is None:

                order[key] = ""

        return jsonify({

            "success": True,

            "order": order

        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==========================================
# CANCEL ORDER
# ==========================================

@order_bp.route("/api/orders/<int:id>/cancel", methods=["PUT"])
def cancel_order(id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE orders
            SET order_status='Cancelled'
            WHERE id=%s
        """, (id,))

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({

                "success": False,

                "message": "Order not found"

            }), 404

        return jsonify({

            "success": True,

            "message": "Order Cancelled Successfully"

        })

    except Exception as e:

        if connection:
            connection.rollback()

        import traceback
        traceback.print_exc()

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()