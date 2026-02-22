from flask import Blueprint, render_template, jsonify
import mysql.connector
import os

main = Blueprint("main", __name__)

def get_db():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

@main.route("/api/events")
def get_events():
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM events ORDER BY date, start_time")
        events = cursor.fetchall()
        for event in events:
            event['date'] = event['date'].strftime('%Y-%m-%d')
            event['start_time'] = str(event['start_time'])
            event['end_time'] = str(event['end_time'])
    finally:
        cursor.close()
        conn.close()
    
    return jsonify(events)

@main.route("/")
def home():
    return render_template('home.html')

@main.route("/events")
def events():
    return render_template('events.html')
