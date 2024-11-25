# Required Imports
from flask import Flask, jsonify, render_template, request
import sqlite3
import requests

# API Keys
UNSPLASH_API_KEY = "nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random?query={category}&orientation=landscape&client_id=" + UNSPLASH_API_KEY

# Initialize Flask App
app = Flask(__name__)

# Utility Functions
def get_db_connection():
    """Establishes and returns a connection to the SQLite database."""
    conn = sqlite3.connect('Database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Routes
@app.route('/')
def splash_screen():
    return render_template('SplashScreen.html')

@app.route('/home')
def home():
    return render_template('Home.html')

@app.route('/todo')
def todo():
    return render_template('ToDo.html')

@app.route('/weather')
def weather():
    return render_template('Weather.html')

@app.route('/get_random_image')
def get_random_image():
    """Fetch a random image from the Unsplash API."""
    query = request.args.get("query", "nature White Background")
    try:
        response = requests.get(UNSPLASH_API_URL.format(category=query))
        if response.status_code == 200:
            data = response.json()
            image_url = data.get('urls', {}).get('regular')
            if image_url:
                return jsonify({'image_url': image_url})
            return jsonify({"message": "No image found"}), 404
        else:
            return jsonify({"error": "API request failed", "status_code": response.status_code}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Request error", "message": str(e)}), 500

@app.route('/get_calendar_event')
def get_calendar_event():
    """Retrieve event titles from the database."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT Title FROM Events")
        rows = cur.fetchall()
        titles = [row["Title"] for row in rows]
        conn.close()
        return jsonify(titles)
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500

@app.route('/add_event', methods=['POST'])
def add_event():
    """Add a new event to the database."""
    try:
        data = request.json
        required_fields = ['Title', 'Description', 'Start_Date', 'End_Date']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        print(data)
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO Events (Title, Description, Start_Date, End_Date)
            VALUES (?, ?, ?, ?)
            """,
            (data['Title'], data['Description'], data['Start_Date'], data['End_Date'])
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Event added successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500

# Main Entry Point
if __name__ == '__main__':
    app.run(debug=True)#change this to false later...
