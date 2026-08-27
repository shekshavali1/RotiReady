import pymysql

def get_connection():

    return pymysql.connect(

        host="localhost",
        user="root",
        password="",
        database="ssv_hotel",

        cursorclass=pymysql.cursors.DictCursor,

        autocommit=True

    )