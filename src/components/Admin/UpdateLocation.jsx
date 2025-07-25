import { useEffect, useState, useRef } from "react";
import showToast from "../HomePage/alert.js";

function UpdateLocation() {
    const [allLocation, setAllLocation] = useState([]);
    const [selectedVanue, setSelectedVanue] = useState("");

    const latitudeRef = useRef(null);
    const longitudeRef = useRef(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch(`http://localhost:3000/Get/getLocation`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllLocation(data);
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleUpdate = async () => {
        const lat = latitudeRef.current.value;
        const lng = longitudeRef.current.value;

        if (!selectedVanue || !lat || !lng) {
            showToast("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/Update/updateLocation`, {
                method: "PUT", // or POST depending on your backend
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vanue: selectedVanue,
                    latitude: lat,
                    longitude: lng,
                }),
            });

            if (response.ok) {
                showToast(`Location ${selectedVanue} updated successfully`);
                latitudeRef.current.value = "";
                longitudeRef.current.value = "";
            } else {
                const errorText = await response.text();
                console.error("Failed to update:", errorText);
                showToast(`Failed to update ${selectedVanue}`);
            }
        } catch (error) {
            console.error("Update request failed:", error);
            showToast("Update failed due to network error.");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-2xl p-6 mt-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Location Coordinates</h2>

            <label className="block mb-2 font-medium text-gray-700">Select Venue:</label>
            <select
                value={selectedVanue}
                onChange={(e) => setSelectedVanue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            >
                <option value="">-- Choose a location --</option>
                {allLocation.map((loc) => (
                    <option key={loc._id} value={loc.vanue}>
                        {loc.vanue}
                    </option>
                ))}
            </select>

            <input
                type="text"
                ref={latitudeRef}
                placeholder="Enter Latitude"
                className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <input
                type="text"
                ref={longitudeRef}
                placeholder="Enter Longitude"
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <button
                onClick={handleUpdate}
                className="w-full bg-orange-400 hover:bg-green-600 text-white py-2 px-4 rounded font-bold"
            >
                Update
            </button>
        </div>
    );
}

export default UpdateLocation;
