from flask import Blueprint, request, jsonify
from config import get_connection
from services.whatsapp import send_whatsapp
import random
import qrcode
import os

order_bp = Blueprint("order", __name__)

# ==========================================
# CREATE ORDER
# ==========================================

@order_bp.route("/api/order", methods=["POST"])
def create_order():

    try:

        data = request.get_json()

        full_name = data["full_name"]
        mobile = data["mobile"]
        quantity = int(data["quantity"])
        pickup_date = data["pickup_date"]
        pickup_time = data["pickup_time"]
        instructions = data.get("instructions", "")

        # Price Calculation
        price = 10
        total = quantity * price
        advance = total / 2
        remaining = total - advance

        # Generate Order ID
        order_id = "SSV" + str(random.randint(100000, 999999))

        # Generate QR Code
        qr = qrcode.make(f"Order ID: {order_id}")

        qr_folder = os.path.join("static", "qr")
        os.makedirs(qr_folder, exist_ok=True)

        qr_filename = f"{order_id}.png"
        qr_path = os.path.join(qr_folder, qr_filename)

        qr.save(qr_path)

        # Database
        conn = get_connection()
        cursor = conn.cursor()

        # Check Customer
        cursor.execute(
            "SELECT id FROM customers WHERE mobile=%s",
            (mobile,)
        )

        customer = cursor.fetchone()

        if customer:

            customer_id = customer["id"]

        else:

            cursor.execute(
                """
                INSERT INTO customers
                (full_name, mobile)
                VALUES (%s,%s)
                """,
                (full_name, mobile)
            )

            conn.commit()

            customer_id = cursor.lastrowid

        # Save Order
        cursor.execute(
            """
            INSERT INTO orders
            (
                order_id,
                customer_id,
                quantity,
                total_amount,
                advance_amount,
                remaining_amount,
                pickup_date,
                pickup_time,
                instructions
            )
            VALUES
            (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                order_id,
                customer_id,
                quantity,
                total,
                advance,
                remaining,
                pickup_date,
                pickup_time,
                instructions
            )
        )

        conn.commit()

        # ==========================================
        # SEND WHATSAPP MESSAGE
        # ==========================================

        message = f"""
🍽️ SSV HOTEL

Hello {full_name},

Your order has been placed successfully.

🆔 Order ID: {order_id}

🍽️ Quantity: {quantity} Rotis

📅 Pickup Date: {pickup_date}

🕒 Pickup Time: {pickup_time}

Thank you for choosing SSV HOTEL ❤️
"""

        send_whatsapp(mobile, message)

        cursor.close()
        conn.close()

        return jsonify({

    "success": True,
    "order_id": order_id,
    "qr_code": f"/static/qr/{order_id}.png",
    "message": "Order Created Successfully"

})

    except Exception as e:

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500
    # ==========================================
# TRACK ORDER
# ==========================================

@order_bp.route("/api/track-order", methods=["POST"])
def track_order():

    try:

        data = request.get_json()

        order_id = data.get("order_id")
        mobile = data.get("mobile")

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                o.order_id,
                c.full_name,
                c.mobile,
                o.quantity,
                o.total_amount,
                o.advance_amount,
                o.remaining_amount,
                o.pickup_date,
                o.pickup_time,
                o.payment_status,
                o.order_status
            FROM orders o
            JOIN customers c
            ON o.customer_id = c.id
            WHERE o.order_id=%s
            AND c.mobile=%s
        """, (order_id, mobile))

        order = cursor.fetchone()

        cursor.close()
        connection.close()

        if not order:

            return jsonify({
                "success": False,
                "message": "Order not found."
            })

        # Convert Decimal/Date/Time to JSON-safe values
        order["total_amount"] = float(order["total_amount"])
        order["advance_amount"] = float(order["advance_amount"])
        order["remaining_amount"] = float(order["remaining_amount"])
        order["pickup_date"] = str(order["pickup_date"])
        order["pickup_time"] = str(order["pickup_time"])

        # QR Code Path
        order["qr_code"] = f"/static/qr/{order['order_id']}.png"

        return jsonify({

            "success": True,
            "order": order

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500
  # ==========================================
# UPDATE ORDER STATUS
# ==========================================

@order_bp.route("/api/update-order-status", methods=["POST"])
def update_order_status():

    try:

        data = request.get_json()

        order_id = data.get("order_id")

        connection = get_connection()
        cursor = connection.cursor()

        # Get current status
        cursor.execute(
            "SELECT order_status FROM orders WHERE order_id=%s",
            (order_id,)
        )

        order = cursor.fetchone()

        if not order:

            cursor.close()
            connection.close()

            return jsonify({
                "success": False,
                "message": "Order not found."
            })

        current_status = order["order_status"]

        if current_status == "Preparing":
            new_status = "Ready"

        elif current_status == "Ready":
            new_status = "Completed"

        else:
            new_status = "Completed"

        # Update status
        cursor.execute(
            """
            UPDATE orders
            SET order_status=%s
            WHERE order_id=%s
            """,
            (new_status, order_id)
        )

        connection.commit()

        # ==========================================
        # GET CUSTOMER DETAILS
        # ==========================================

        cursor.execute("""
            SELECT
                c.full_name,
                c.mobile,
                o.order_status
            FROM orders o
            JOIN customers c
            ON o.customer_id = c.id
            WHERE o.order_id=%s
        """, (order_id,))

        customer = cursor.fetchone()

        if customer:

            name = customer["full_name"]
            mobile = customer["mobile"]
            status = customer["order_status"]

            if status == "Preparing":

                message = f"""
🍽️ SSV HOTEL

Hello {name},

👨‍🍳 Your order is now being prepared.

Thank you for your patience.
"""

            elif status == "Ready":

                message = f"""
🍽️ SSV HOTEL

🎉 Hello {name},

Your order is READY.

Please collect it from the hotel.

Thank you ❤️
"""

            else:

                message = f"""
🍽️ SSV HOTEL

✅ Thank you {name}

Your order has been completed.

⭐ We'd love your feedback!

Thank you for visiting SSV HOTEL ❤️
"""

            send_whatsapp(mobile, message)

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "new_status": new_status
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
# ==========================================
# ADMIN - GET ALL ORDERS
# ==========================================

@order_bp.route("/api/admin/orders", methods=["GET"])
def get_all_orders():

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                o.order_id,
                c.full_name,
                c.mobile,
                o.quantity,
                o.total_amount,
                o.advance_amount,
                o.remaining_amount,
                o.pickup_date,
                o.pickup_time,
                o.payment_status,
                o.order_status
            FROM orders o
            JOIN customers c
            ON o.customer_id = c.id
            ORDER BY o.created_at DESC
        """)

        orders = cursor.fetchall()

        cursor.close()
        connection.close()

        for order in orders:

            order["total_amount"] = float(order["total_amount"])
            order["advance_amount"] = float(order["advance_amount"])
            order["remaining_amount"] = float(order["remaining_amount"])
            order["pickup_date"] = str(order["pickup_date"])
            order["pickup_time"] = str(order["pickup_time"])
            order["qr_code"] = f"/static/qr/{order['order_id']}.png"

        return jsonify({

            "success": True,
            "orders": orders

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500
    # ==========================================
# CUSTOMER ORDER HISTORY
# ==========================================

@order_bp.route("/api/order-history", methods=["POST"])
def order_history():

    try:

        data = request.get_json()

        mobile = data.get("mobile")

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                o.order_id,
                o.quantity,
                o.total_amount,
                o.pickup_date,
                o.pickup_time,
                o.order_status,
                o.payment_status
            FROM orders o
            JOIN customers c
            ON o.customer_id = c.id
            WHERE c.mobile = %s
            ORDER BY o.created_at DESC
        """, (mobile,))

        orders = cursor.fetchall()

        cursor.close()
        connection.close()

        for order in orders:

            order["total_amount"] = float(order["total_amount"])
            order["pickup_date"] = str(order["pickup_date"])
            order["pickup_time"] = str(order["pickup_time"])

        return jsonify({

            "success": True,
            "orders": orders

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500