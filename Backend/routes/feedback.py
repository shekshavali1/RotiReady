from flask import Blueprint, request, jsonify
from config import get_connection

feedback_bp = Blueprint("feedback_bp", __name__)


@feedback_bp.route("/api/feedback", methods=["POST"])
def save_feedback():

    try:

        data = request.get_json()

        order_id = data.get("order_id")
        customer_name = data.get("customer_name")
        mobile = data.get("mobile")
        rating = data.get("rating")
        review = data.get("review")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO feedback
            (
                order_id,
                customer_name,
                mobile,
                rating,
                review
            )
            VALUES (%s,%s,%s,%s,%s)
        """,
        (
            order_id,
            customer_name,
            mobile,
            rating,
            review
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Feedback Saved Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })