// problem here is that the api key is on the front end , which is a huge security risk
// we should move the api key to the backend and make a request to the backend to get
// the data from the api
const apiKey = "920fa755c2a59658cedef9e6b76f8cad";
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Ensure DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector('.search input');
    const searchBtn = document.querySelector('.search button');

    if (!searchBox || !searchBtn) {
        console.error("Search elements not found in the DOM.");
        return;
    }

    // Add event listener for search button
    searchBtn.addEventListener("click", () => {
        const city = searchBox.value.trim();
        if (city) getWeather(city);
    });

    // Fetch default weather for "London"
    getWeather("London");
});

// Fetch weather data from API
async function getWeather(city) {
    try {
        const response = await fetch(url + city + `&appid=${apiKey}`);
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);

        const data = await response.json();
        console.log(data);

        // Update the UI with weather data
        document.querySelector(".city").innerHTML = data.name || "Unknown City";
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".city").innerHTML = "Error: " + error.message;
    }
}
