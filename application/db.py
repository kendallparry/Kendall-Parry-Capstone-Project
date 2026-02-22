import mysql.connector

conn = mysql.connector.connect(
    host='database-1.c38ececucppv.us-west-2.rds.amazonaws.com',
    port=3306,
    user='admin',
    password='YgSqKds4S5vhPgo2oHPU',
    database='mysql'
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()
cursor.close()
conn.close()