from flask import Flask
from flask_cors import CORS
from config import get_connection
from routes.order import order_bp
from routes.admin import admin_bp
from routes.feedback import feedback_bp
from routes.admin_feedback import admin_feedback_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(order_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(admin_feedback_bp)
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

if __name__ == "__main__":
    app.run(debug=True)