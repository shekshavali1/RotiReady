from flask import Blueprint, request, jsonify
from config import get_connection

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/api/admin/login", methods=["POST"])
def admin_login():

    try:

        data = request.json

        username = data.get("username")
        password = data.get("password")

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT * FROM admins
            WHERE username=%s AND password=%s
            """,
            (username, password)
        )

        admin = cursor.fetchone()

        cursor.close()
        connection.close()

        if admin:

            return jsonify({
                "success": True,
                "message": "Login Successful"
            })

        return jsonify({
            "success": False,
            "message": "Invalid Username or Password"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })
    # ==========================================
# UPDATE ORDER STATUS
# ==========================================

@admin_bp.route("/api/admin/update-status/<order_id>", methods=["PUT"])
def update_order_status(order_id):

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT order_status FROM orders WHERE order_id=%s",
            (order_id,)
        )

        result = cursor.fetchone()

        if not result:

            cursor.close()
            connection.close()

            return jsonify({
                "success": False,
                "message": "Order not found."
            })

        current_status = result["order_status"]

        if current_status == "Preparing":

            new_status = "Ready"

        elif current_status == "Ready":

            new_status = "Completed"

        else:

            new_status = "Completed"

        cursor.execute(
            """
            UPDATE orders
            SET order_status=%s
            WHERE order_id=%s
            """,
            (new_status, order_id)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({

            "success": True,

            "message": "Status Updated",

            "status": new_status

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        })
    