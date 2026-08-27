from flask import Blueprint, request, jsonify
from config import get_connection

payment_bp = Blueprint("payment", __name__)

@payment_bp.route("/api/payment", methods=["POST"])
def payment():

    try:

        data = request.get_json()

        order_id = data["order_id"]
        paid_amount = data["paid_amount"]
        payment_method = data["payment_method"]

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO payments
            (order_id, transaction_id, payment_method, paid_amount)
            VALUES (%s, %s, %s, %s)
        """, (
            order_id,
            "TXN" + str(order_id),
            payment_method,
            paid_amount
        ))

        cursor.execute("""
            UPDATE orders
            SET payment_status='Paid'
            WHERE id=%s
        """, (order_id,))

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Payment Saved Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500