// Define your OpenWeatherMap API endpoint and API key
const WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = "124b92a8dd9ec01ffb0dbf64bc44af3c"; // OpenWeatherMap API key

// Define your AWS API Gateway endpoint
const AWS_API_ENDPOINT = "https://erf6rpag56.execute-api.us-east-2.amazonaws.com/sowri"; // Replace with your actual AWS API Gateway endpoint

// Function to fetch weather data from OpenWeatherMap API
document.getElementById("get-city").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        fetchWeatherData();
    }
});

function fetchWeatherData() {
    const city = document.getElementById("get-city").value;
    if (!city) {
        alert("Please enter a city.");
        return;
    }

    const url = `${WEATHER_API_ENDPOINT}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`; // Using metric units for Celsius

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather data fetched successfully:", data); // Log the response for debugging
            updateWeatherData(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error); // Log error details
            alert("Error retrieving weather data.");
        });
}

// Function to save weather data to AWS API Gateway
document.getElementById("saveWeather").addEventListener("click", function() {
    const city = document.getElementById("get-city").value;
    const weatherData = {
        city: city,
        temperature: document.querySelector(".weather-deg").textContent,
        condition: document.querySelector(".weather-condition").textContent,
        humidity: document.querySelector(".humidity").textContent,
        date: getDate()
    };

    fetch(AWS_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(weatherData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Weather data saved successfully:", data); // Log the response for debugging
            document.getElementById("saveStatus").textContent = "Weather data saved!";
        })
        .catch(error => {
            console.error("Error saving weather data:", error); // Log error details
            alert("Error saving weather data.");
        });
});

// Function to retrieve and display weather data from AWS API Gateway
document.getElementById("getWeatherData").addEventListener("click", function() {
    fetch(AWS_API_ENDPOINT)
        .then(response => response.json())
        .then(data => {
            console.log("Weather data retrieved successfully:", data); // Log the response for debugging
            const tableBody = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ""; // Clear existing table rows
            data.forEach(entry => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = entry.city;
                row.insertCell(1).textContent = entry.temperature;
                row.insertCell(2).textContent = entry.condition;
                row.insertCell(3).textContent = entry.humidity;
                row.insertCell(4).textContent = entry.date;
            });
        })
        .catch(error => {
            console.error("Error retrieving weather data:", error); // Log error details
            alert("Error retrieving weather data.");
        });
});

// Function to update the DOM with weather data
function updateWeatherData(data) {
    if (data.cod !== 200) {  // Check if there was an error in the API response
        console.error('Error:', data.message);
        document.querySelector(".city-name").textContent = "Error: " + data.message;
        return;
    }

    document.querySelector(".city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.querySelector(".weather-deg").textContent = `${Math.round(data.main.temp)}°C`; // Temperature in Celsius
    document.querySelector(".weather-condition").textContent = data.weather[0].description;
    document.querySelector(".humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.querySelector(".date").textContent = getDate();
}

// Utility function to get today's date
function getDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const newTime = new Date();
    const month = months[newTime.getMonth()];
    return `${newTime.getDate()} ${month} ${newTime.getFullYear()}`;
}
