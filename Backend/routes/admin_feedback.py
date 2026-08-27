from flask import Blueprint, jsonify
from config import get_connection
from datetime import datetime, date, time, timedelta
import traceback

admin_feedback_bp = Blueprint("admin_feedback_bp", __name__)

# ==========================================
# GET ALL FEEDBACK (ADMIN)
# ==========================================

@admin_feedback_bp.route("/api/admin/feedback", methods=["GET"])
def get_feedback():

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT *
            FROM feedback
            ORDER BY created_at DESC
        """)

        feedback = cursor.fetchall()

        cursor.close()
        conn.close()

        # Convert MySQL objects to JSON
        for item in feedback:
            for key, value in item.items():

                if isinstance(value, timedelta):
                    item[key] = str(value)

                elif isinstance(value, (datetime, date, time)):
                    item[key] = value.isoformat()

                elif value is None:
                    item[key] = ""

        return jsonify({
            "success": True,
            "feedback": feedback
        })

    except Exception as e:
     import traceback
    traceback.print_exc()

    return jsonify({
        "success": False,
        "message": str(e)
    }), 500