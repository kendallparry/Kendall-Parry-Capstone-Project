from flask import Blueprint, jsonify, render_template

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return render_template('home.html')
