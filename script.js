const API_KEY = '9b28bf84949a3e617acbaa1dc99ef9c1'; // Your OpenWeatherMap API key

// Function to fetch weather by city name
async function fetchWeatherByCity(city) {
    console.log("Fetching weather for city:", city); // Debugging log
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        console.log("Response status:", response.status); // Debugging log

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        console.log("Weather data for city:", data); // Debugging log
        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon); // Call forecast with coordinates
    } catch (error) {
        alert(error.message);
        console.error("Error fetching weather by city:", error); // Debugging log
    }
}

// Function to fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    console.log("Fetching weather by coordinates:", lat, lon); // Debugging log
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        console.log("Response status:", response.status); // Debugging log

        if (!response.ok) throw new Error("Could not fetch weather for coordinates");

        const data = await response.json();
        console.log("Weather data for coordinates:", data); // Debugging log
        displayCurrentWeather(data);
        fetchForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching weather by coordinates:", error); // Debugging log
    }
}

function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    
    // Get current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('currentWeather').innerHTML = `
        <h2>${name}</h2>
        <p><strong>Date:</strong> ${formattedDate}</p> <!-- Display current date -->
        <img src="${iconUrl}" alt="${weather[0].description}" />
        <p>Temperature: ${main.temp} °C</p>
        <p>Condition: ${weather[0].main}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;

    setDynamicBackground(weather[0].main);
}

// Fetch a 5-day weather forecast
async function fetchForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        console.log("Forecast response status:", response.status); // Debugging log

        if (!response.ok) throw new Error("Could not fetch forecast");

        const data = await response.json();
        console.log("5-day forecast data:", data); // Debugging log
        displayForecast(data);
    } catch (error) {
        console.error("Error fetching forecast:", error); // Debugging log
    }
}

// Display 5-day forecast in the UI
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    forecastList.forEach(day => {
        const date = new Date(day.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastContainer.innerHTML += `
            <div>
                <p>${date.toDateString()}</p>
                <img src="${iconUrl}" alt="${day.weather[0].description}" />
                <p>${day.main.temp} °C</p>
                <p>${day.weather[0].main}</p>
            </div>
        `;
    });
}

// Change background based on weather condition
function setDynamicBackground(weatherCondition) {
    const body = document.body;
    switch (weatherCondition) {
        case 'Clear':
            body.style.background = 'linear-gradient(135deg, #ffdd89, #ff8a00)';
            break;
        case 'Clouds':
            body.style.background = 'linear-gradient(135deg, #a1c4fd, #c2e9fb)';
            break;
        case 'Rain':
            body.style.background = 'linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)';
            break;
        case 'Snow':
            body.style.background = 'linear-gradient(135deg, #f1f2f6, #dfe9f3)';
            break;
        default:
            body.style.background = 'linear-gradient(135deg, #74ebd5, #acb6e5)';
    }
}

// Fetch weather based on user's location on page load
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("User's coordinates:", latitude, longitude); // Debugging log
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Geolocation is not enabled. Please allow location access or enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Event listener for manual city search
document.getElementById('cityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchWeatherByCity(e.target.value);
    }
});

// Load weather data for the user's current location by default
window.onload = getLocationWeather;
