from flask import Blueprint, jsonify
from config import get_connection

admin_feedback_bp = Blueprint("admin_feedback_bp", __name__)

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

        return jsonify({
            "success": True,
            "feedback": feedback
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })
    
    
    from flask import Blueprint, jsonify
from config import get_connection

admin_feedback_bp = Blueprint("admin_feedback_bp", __name__)

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

        return jsonify({
            "success": True,
            "feedback": feedback
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })