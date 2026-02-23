from flask import Blueprint, render_template, jsonify, request
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

@main.route("/api/events", methods=["POST"])
def create_event():
    data = request.get_json()
    conn = get_db()
    try: 
        cursor = conn.cursor()
        cursor.execute("""
                       INSERT INTO events (title, date, start_time, end_time, location, notes)
                       VALUES (%s, %s, %s, %s, %s, %s)
                       """, (data['title'], data['date'], data['start_time'], data['end_time'], data['location'], data['notes']))
        conn.commit()
        event_id = cursor.lastrowid
    finally:
        cursor.close()
        conn.close()
    return jsonify({'event_id': event_id}), 201

@main.route("/api/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE events SET title=%s, date=%s, start_time=%s, end_time=%s, location=%s, notes=%s
            WHERE event_id=%s
        """, (data['title'], data['date'], data['start_time'], data['end_time'], data['location'], data['notes'], event_id))
        conn.commit()
    finally:
        cursor.close()
        conn.close()
    return jsonify({'success': True})

@main.route("/api/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM events WHERE event_id=%s", (event_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()
    return jsonify({'success': True})

@main.route("/")
def home():
    return render_template('home.html')

@main.route("/events")
def events():
    return render_template('events.html')

@main.route("/resources")
def resources():
    return render_template('resources.html')

@main.route("/settings")
def settings():
    return render_template('settings.html')