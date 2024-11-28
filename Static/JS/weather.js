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
        const response = await fetch('/get_weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });

        if (!response.ok) throw new Error(`API error: ${response.statusText}`);

        const data = await response.json();

        console.log(data);

        if (data.name && data.main && data.wind) {

            // Update the UI with weather data
            document.querySelector(".city").innerHTML = data.name || "Unknown City";
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        } else {
            throw new Error("Invalid weather data received.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".city").innerHTML = "Error: " + error.message;
    }
}
