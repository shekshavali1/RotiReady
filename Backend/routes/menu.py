from flask import Blueprint, request, jsonify
from config import get_connection
import os
from werkzeug.utils import secure_filename
from flask import current_app

menu_bp = Blueprint("menu", __name__)

# ==========================
# GET ALL MENU ITEMS
# ==========================
@menu_bp.route("/api/menu", methods=["GET"])
def get_menu():

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM menu_items
            ORDER BY category, id
        """)

        menu = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "menu": menu
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    # ==========================
# ADD MENU ITEM
# ==========================

@menu_bp.route("/api/menu", methods=["POST"])
def add_menu():

    try:

        item_name = request.form["item_name"]
        price = request.form["price"]
        category = request.form["category"]
        status = request.form["status"]

        image_name = ""

        if "image" in request.files:

            image = request.files["image"]

            if image.filename != "":

                image_name = secure_filename(image.filename)

                image.save(
                    os.path.join(
                        current_app.config["UPLOAD_FOLDER"],
                        image_name
                    )
                )

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO menu_items
            (
                item_name,
                price,
                category,
                image,
                status
            )
            VALUES(%s,%s,%s,%s,%s)
        """,
        (
            item_name,
            price,
            category,
            image_name,
            status
        ))

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Menu Item Added Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }),500
    # ==========================
# DELETE MENU ITEM
# ==========================
@menu_bp.route("/api/menu/<int:id>", methods=["DELETE"])
def delete_menu(id):

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM menu_items WHERE id=%s",
            (id,)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Menu Item Deleted Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
    # ==========================
# UPDATE MENU ITEM
# ==========================
# ==========================
# UPDATE MENU ITEM
# ==========================
@menu_bp.route("/api/menu/<int:id>", methods=["PUT"])
def update_menu(id):

    try:

        item_name = request.form["item_name"]
        price = request.form["price"]
        category = request.form["category"]
        status = request.form["status"]

        image_name = request.form.get("old_image", "")

        if "image" in request.files:

            image = request.files["image"]

            if image.filename != "":

                image_name = secure_filename(image.filename)

                image.save(
                    os.path.join(
                        current_app.config["UPLOAD_FOLDER"],
                        image_name
                    )
                )

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE menu_items
            SET
                item_name=%s,
                price=%s,
                category=%s,
                image=%s,
                status=%s
            WHERE id=%s
        """,
        (
            item_name,
            price,
            category,
            image_name,
            status,
            id
        ))

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Menu Updated Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500