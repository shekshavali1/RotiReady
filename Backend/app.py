from flask import Flask, send_from_directory
from flask_cors import CORS
from config import get_connection

from routes.order import order_bp
from routes.menu import menu_bp
from routes.admin import admin_bp
from routes.feedback import feedback_bp
from routes.admin_feedback import admin_feedback_bp
from routes.payment import payment_bp

import os

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Register Blueprints
app.register_blueprint(order_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(admin_feedback_bp)
app.register_blueprint(payment_bp)


@app.route("/")
def home():
    return {
        "status": "success",
        "message": "SSV HOTEL Backend Running 🚀"
    }


@app.route("/test-db")
def test_db():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT DATABASE();")
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "database": result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )