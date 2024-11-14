# pip install flask
from flask import Flask, render_template, request, redirect, url_for, flash
##API KEYS##
#Unsplash API key
UNSPLASH_API_KEY = "nLfSlOoclheYYtRhGHZi5FIBixRMjTJe7Ra6BsVbKEg"
#Unsplash API URL
UNSPLASH_API_URL = "https://api.unsplash.com/photos/random"



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

def get_random_image():
    query = request.args.get("query", "Nature")

    response = request.get(
        UNSPLASH_API_URL,
        headers={"Authorization": f"Bearer {UNSPLASH_API_KEY}"},
        params={"query": query,"orinetation":"landscape"}
    )

    if response.status_code == 200:
        return response.json()

if __name__ == '__main__':
    app.run(debug=True)