import os
import pymysql


def get_connection():

    host = os.environ.get("MYSQLHOST")
    user = os.environ.get("MYSQLUSER")
    password = os.environ.get("MYSQLPASSWORD")
    database = os.environ.get("MYSQLDATABASE")
    port = int(os.environ.get("MYSQLPORT", "3306"))

    print("DB_HOST:", host)
    print("DB_USER:", user)
    print("DB_NAME:", database)
    print("DB_PORT:", port)

    return pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )