import React, { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "35c9cf6a85cb571339cccf2bf64cb5ad";

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }
    try {
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("Unable to find weather for the specified city.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Weather App</h1>
        <input
          type="text"
          className="border rounded-lg w-full p-2 mb-4"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
          onClick={fetchWeather}
        >
          Get Weather
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {weather && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">{weather.name}</h2>
            <p className="text-lg">
              {weather.weather[0].description.toUpperCase()}
            </p>
            <p className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
