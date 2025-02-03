import axios from 'axios';

async function getLocation() {
    try {
        // Get Public IP
        const ipResponse = await axios.get('https://api64.ipify.org?format=json');
        const myIP = ipResponse.data.ip;
        console.log("Your Public IP:", myIP);

        // Get Geolocation
        const geoResponse = await axios.get(`https://ipwhois.app/json/${myIP}`);
        console.log("Location Data:", geoResponse.data);
    } catch (error) {
        console.error("Error fetching location:", error.message);
    }
}

getLocation();
