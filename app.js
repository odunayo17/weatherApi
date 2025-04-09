const express           = require('express');
const axios             = require('axios');
const dotenv            = require('dotenv').config({ path: './config/.env' });
const path              = require('path');

const app       = express();
const PORT      = process.env.PORT || 5000;
const API_KEY   = process.env.OPENWEATHER_API_KEY;

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Weather API route
app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;

    let url;
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
        return res.status(400).json({ error: 'Please provide a city or coordinates (lat and lon).' });
    }

    try {
        const response = await axios.get(url);
        const data = response.data;

        res.json({
            location: data.name,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            description: data.weather[0].description,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('API Key:', API_KEY); // This should print your actual API key

});
