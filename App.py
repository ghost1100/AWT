#pip install requests
#pip install sqlite3
#pip install Flask
#pip install python-dotenv
#pip install gunicorn
#should add flask wtf for form handling later but i have no need to do so later
#while sqlite 3 is a good db, it's not the best for large scale apps nor for non local deployment, consider migrating to postgrade or something like that
#If your app will be accessed from other domains (like a front-end running separately), consider adding CORS (Cross-Origin Resource Sharing) support to allow the back-end to communicate with front-end applications on different domains.
from multiprocessing import process
import os
from flask import Flask, jsonify, render_template, request
import sqlite3
import requests
from datetime import datetime
from dotenv import load_dotenv
import psycopg2 

load_dotenv("Storage.env")
# API Keys
UNSPLASH_API_KEY = "nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random?query={category}&orientation=landscape&client_id=" + UNSPLASH_API_KEY

Weather_API_KEY = os.getenv("WEATHER_API_KEY")
if Weather_API_KEY is None:
    print("Please set the WEATHER_API_KEY environment variable")
    exit()
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

# Initializes the Flask App
app = Flask(__name__)

# Utility Functions
def get_db_connection():
    #creates and returns connection
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        conn = psycopg2.connect(database_url, sslmode='require') 
    else:
        conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# page routing
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

#OpenWeatherMap Route
@app.route('/get_weather', methods=['POST'])
def get_weather():
    # Get the city from the request
    city = request.json.get('city')
    if city is None:
        return jsonify({"error": "City not provided"}), 400
    try:
        #Make the api request
        response = requests.get(f"{WEATHER_API_URL}{city}&appid={Weather_API_KEY}")
        response.raise_for_status()# raise an exception for HTTP errors
        weather_data = response.json()
        return jsonify(weather_data), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to retrieve weather data"}), 500


#unsplash api routing grabs a random image, its displayed through the js.
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


#meant to retrive the events and display them on the home page.... 
@app.route('/get_calendar_events', methods=['GET'])
def get_calendar_events():
    """Retrieve all events from the database."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT Title, Start_Date FROM Events")
        rows = cur.fetchall()
        events = [{"Title": row["Title"], "Start_Date": row["Start_Date"]
                   } for row in rows]
        conn.close()
        return jsonify(events)
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500
    



@app.route('/delete_event', methods=['POST'])
def delete_event():
    """Delete events from the database based on their date."""
    try:
        # Validate and parse the date
        event_date = request.json.get('Date')
        if not event_date:
            return jsonify({"error": "Missing 'Date' in request payload"}), 400

        try:
            # Ensure the date format is correct: YYYY-MM-DD
            parsed_date = datetime.strptime(event_date, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD'."}), 400

        conn = get_db_connection()
        cur = conn.cursor()
        # Debug: Print the query and the date to ensure it's correct
        print(f"Deleting events on {parsed_date}")
        cur.execute("DELETE FROM Events WHERE Start_Date = ?", (parsed_date,))
        conn.commit()

        # Check how many rows were affected
        rows_deleted = cur.rowcount
        conn.close()

        if rows_deleted == 0:
            return jsonify({"message": f"No events found for {event_date}."}), 404
        return jsonify({"message": f"Events on {event_date} deleted successfully"}), 200

    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500




#adds the events into DB.
@app.route('/add_event', methods=['POST'])
def add_event():
    """Add a new event to the database."""
    try:
        data = request.json
        required_fields = ['Title', 'Description', 'Start_Date']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO Events (Title, Description, Start_Date)
            VALUES (?, ?, ?)
            """,
            (data['Title'], data['Description'], data['Start_Date'])
        )
        event_id = cur.lastrowid
        conn.commit()
        conn.close()
        return jsonify({ "id" : event_id, "message": "Event added successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500
    

    #ToDo List starts here.
@app.route('/add_task', methods=['POST'])
def add_task():
    """Add a new task to the database."""
    try:
        data = request.json
        required_fields = ['Description', 'DueDate', 'Status']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO ToDo (Description, DueDate, Status) VALUES (?, ?, ?)""",
            (data['Description'], data['DueDate'], bool(data['Status']))  
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Task added successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500

@app.route('/delete_task', methods=['POST'])
def delete_task():
    """Delete a task from the database."""
    try:
        data = request.json
        task_id = data.get('TaskID') 
        if not task_id:
            return jsonify({"error": "TaskID is required"}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM ToDo WHERE TaskID = ?", (task_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Task deleted successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500

@app.route('/show_task', methods=['GET'])
def show_task():
    """Show all tasks from the database."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT TaskID, Description, DueDate, Status FROM ToDo")
        tasks = [
            {
                "TaskID": row["TaskID"],
                "Description": row["Description"],
                "DueDate": row["DueDate"],
                "Status": bool(row["Status"])  # Convert to boolean for frontend
            }
            for row in cur.fetchall()
        ]
        conn.close()
        return jsonify(tasks), 200
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500

@app.route('/update_task', methods=['POST'])
def update_task():
    """Update task status in the database."""
    try:
        data = request.json
        task_id = data.get('TaskID')
        status = data.get('Status')

        if task_id is None or status is None:
            return jsonify({"error": "TaskID and Status are required"}), 400

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE ToDo SET Status = ? WHERE TaskID = ?", (status, task_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Task updated successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500

# Main Entry Point
if __name__ == '__main__':
    app.run(debug=True)  # Change this to False in production