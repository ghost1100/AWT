# pip install flask
# pip install requests
import sqlite3
from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
from tkinter import ttk
import requests
import sqlite3 


conn = sqlite3.connect('Database.db')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables in the database: ", c.fetchall())
#just to confirm that my tables exsist and they do...


##API KEYS##
#Unsplash API key
UNSPLASH_API_KEY = "nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"
#Unsplash API URL
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random?query={category}&orientation=landscape&client_id=nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"



app = Flask(__name__)

@app.route('/')
def splash_screen():
    return render_template('SplashScreen.html') 

@app.route('/home')
def home():
    return render_template ('Home.html')

@app.route('/todo')  
def todo():
    return render_template('ToDo.html')  

@app.route('/weather') 
def weather():
    return render_template('Weather.html')


@app.route ('/get_random_image')
def get_random_image():
    query = request.args.get("query","nature")
    response = requests.get(UNSPLASH_API_URL.format(category=query))
    data = response.json()
    image_url = data['urls']['regular'] if 'urls' in data and 'regular' in data ['urls'] else None
    if response.status_code == 200:
        try:
            data = response.json()
            image_url = data['urls']['regular'] if 'urls' in data and 'regular' in data['urls'] else None
            if image_url:
                return jsonify({'image_url': image_url})
            else:
                return jsonify({"message": "No image found"}), 404
        except ValueError as e:
            return jsonify({"error": "JSON decode error", "message": str(e)}), 500
    else:
        return jsonify({"error": "API request failed", "status_code": response.status_code}), response.status_code

    

def get_db_connection():
        conn = sqlite3.connect('Database.db')
        conn.row_factory = sqlite3.Row
        return conn

@app.route('/get_todo_list')
def get_todo_list():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM todo_list")
    rows = cur.fetchall()
    return jsonify(rows)


@app.route('/get_calendar_event')
def get_calendar_event():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Events")
    rows = cur.fetchall()
    return jsonify(rows)

@app.route('/add_event', methods=['POST'])
def add_event():
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    cur.execute(
          """INSERT INTO Events (Title, Description, Start_Date, End_Date)
            VALUES (?, ?, ?, ?)
            """,
              (data['title'], data['description'], data['start_date'], data['end_date'])
    )
    if not all(key in data for key in ['title', 'description', 'start_date', 'end_date']):
        return jsonify({"error": "Missing required fields"}), 400
                
    conn.commit()
    conn.close()
    return jsonify({"message": "Event added successfully"}), 201
         


if __name__ == '__main__':
    app.run(debug=True)