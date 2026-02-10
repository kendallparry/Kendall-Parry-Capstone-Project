from flask import Blueprint, render_template, url_for

main = Blueprint("main", __name__)

@main.route("/")
def home():
    return render_template('home.html')

@main.route("/events")
def events():
    return render_template('events.html')
