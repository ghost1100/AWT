const apiKey = "920fa755c2a59658cedef9e6b76f8cad";
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=berlin";

async function getWeather() {
    const response = await fetch(url + `&appid=${apiKey}`);
    var data = await response.json();
    console.log(data);

}
getWeather();