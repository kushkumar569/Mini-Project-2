import { useEffect, useState } from "react";
import showToast from "../HomePage/alert.js";

function DeleteLocation() {
    const [allLocation, setAllLocation] = useState([]);
    const [selectedVanue, setSelectedVanue] = useState("");

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

    const handleDelete = async (vanue, id) => {
        setSelectedVanue(vanue);
        try {
            const response = await fetch(`http://localhost:3000/Delete/DeleteLocation`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ vanue }),
            });
    
            if (response.ok) {
                console.log("Location deleted successfully")          
                showToast(`Location ${vanue} deleted successfully`);
                setAllLocation((prev) => prev.filter(loc => loc._id !== id));
            } else {
                const errorText = await response.text();
                console.error("Failed to delete:", errorText);
                showToast(`Failed to delete ${vanue}`);
            }
        } catch (error) {
            console.error("Delete request failed:", error);
        }
    };
    


    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg p-6 mt-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Location</h2>
            {allLocation.length === 0 ? (
                <p className="text-gray-600">No locations available.</p>
            ) : (
                <ul className="space-y-2">
                    {allLocation.map((loc) => (
                        <li
                            key={loc._id}
                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                        >
                            <span className="text-gray-800 font-medium">{loc.vanue}</span>
                            <button
                                onClick={() => handleDelete(loc.vanue, loc._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DeleteLocation;
