#pip install requests
#pip install sqlite3
#pip install Flask
from flask import Flask, jsonify, render_template, request
import sqlite3
import requests
from datetime import datetime

# API Keys
UNSPLASH_API_KEY = "nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random?query={category}&orientation=landscape&client_id=" + UNSPLASH_API_KEY

# Initializes the Flask App
app = Flask(__name__)

# Utility Functions
def get_db_connection():
    #creates and returns connection
    conn = sqlite3.connect('Database.db')
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
        events = [{"Title": row["Title"], "Start_Date": row["Start_Date"]} for row in rows]
        conn.close()
        return jsonify(events)
    except sqlite3.Error as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500
    
    #a functionality to delete events from the database
@app.route('/delete_event', methods=['POST'])
def delete_event():
    """Delete events from the database based on their date."""
    try:
        # Validate and parse the date
        event_date = request.json.get('Date')
        if not event_date:
            return jsonify({"error": "Missing 'Date' in request payload"}), 400

        try:
            parsed_date = datetime.strptime(event_date, '%Y-%m-%d').date()  # Adjust format if needed
        except ValueError:
            return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD'."}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM Events WHERE Date = ?", (parsed_date,))
        
        conn.commit()
        conn.close()

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
            VALUES (?, ?, ?, ?)
            """,
            (data['Title'], data['Description'], data['Start_Date'])
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Event added successfully"}), 201
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