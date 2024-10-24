<<<<<<< Updated upstream
# pip install flask
from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
=======
# pip install flask
from flask import Flask, render_template, request, redirect, url_for, flash

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

if __name__ == '__main__':
>>>>>>> Stashed changes
    app.run(debug=True)