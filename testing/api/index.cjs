require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

//  Convert City Name to Latitude & Longitude
async function getCoordinates(city) {
    try {
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(geoUrl);
        
        if (response.data.status === "OK") {
            const location = response.data.results[0].geometry.location;
            return `${location.lat},${location.lng}`;
        } else {
            throw new Error("Location not found");
        }
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error;
    }
}

//  Get Famous Places Near a Location
app.get("/famous-places", async (req, res) => {
    try {
        const city = req.query.location || "Delhi";
        const radius = 5000; // 5km radius

        // Convert city name to lat/lng
        const location = await getCoordinates(city);

        // Search for famous places
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=tourist_attraction&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(placesUrl);
        // console.log("response:- ",response);
        
        const places = response.data.results;
        // console.log("places:- ",places);
        
        if (places.length === 0) {
            return res.json({ message: "No famous places found." });
        }

        // Format response
        const formattedPlaces = places.map(place => ({
            name: place.name,
            user_ratings_total: place.user_ratings_total,
            address: place.vicinity || "No address available",
            rating: place.rating || "No rating",
            type: place.types ? place.types.join(", ") : "Unknown type",
            photo: place.photos
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                : "No image available",
            vicinity: place.vicinity,
            geometry: {lat:place.geometry.location.lat, lng:place.geometry.location.lng}
        }));

        res.json(formattedPlaces);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error fetching famous places." });
    }
});

//  Autocomplete Suggestions for City Names
app.get("/autocomplete", async (req, res) => {
    try {
        const input = req.query.input;
        if (!input) {
            return res.status(400).json({ error: "Input parameter is required" });
        }

        const autoUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(autoUrl);

        res.json(response.data.predictions.map(prediction => prediction.description));
    } catch (error) {
        console.error("Autocomplete Error:", error);
        res.status(500).json({ error: "Error fetching autocomplete suggestions." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
