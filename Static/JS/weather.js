// problem here is that the api key is on the front end , which is a huge security risk
// we should move the api key to the backend and make a request to the backend to get
// the data from the api
const apiKey = "920fa755c2a59658cedef9e6b76f8cad";
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
try{ getWeather("London");}
catch(err){
    console.log(err);
    }
async function getWeather(city) {
    try{
        const response = await fetch(url + city + `&appid=${apiKey}`);
        var data = await response.json();
        console.log(data);
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
    
    }
    catch(error){
        console.error(error);
        document.querySelector(".city").innerHTML = "Error:" + error.message;
        }
    }
  
searchBtn.addEventListener("click",()=>{
    const city = searchBox.value.trim();
   if(city) getWeather(city);
});

getWeather("London");//giving a default city


document.addEventListener("DOMContentLoaded",()=>{
    const searchBox = document.querySelector('.search input');
    const searchBtn = document.querySelector('.search button');
    
    if (searchBox && searchBtn) {
        searchBtn.addEventListener("click", () => {
            const city = searchBox.value.trim();
            if (city) getWeather(city);
        });
    
        // Default weather fetch
        getWeather("London");
    } else {
        console.error("Search elements not found in the DOM.");
    }
});