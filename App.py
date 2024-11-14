# pip install flask
# pip install requests
from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
from tkinter import ttk
import requests # type: ignore

##API KEYS##
#Unsplash API key
UNSPLASH_API_KEY = "nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"
#Unsplash API URL
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random?query={category}&orientation=landscape&client_id=nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"



app = Flask(__name__)

@app.route('/')
def home():
    return render_template ('Home.html')


@app.route('/splashscreen')
def splash_screen():
    return render_template('SplashScreen.html') 

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

@app.route('/display_image')
def display_image(image_url):
    image_url = request.args.get("image_url")
    return render_template('Home.html', image_url=image_url)


if __name__ == '__main__':
    app.run(debug=True)