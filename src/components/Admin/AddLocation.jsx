import { useRef } from "react";
import ShowToast from "../HomePage/alert.js";

function AddLocation() {
  const venueRef = useRef();
  const latRef = useRef();
  const lngRef = useRef();

  const handleSubmit = async () => {
    const locationData = {
      venue: venueRef.current.value,
      latitude: latRef.current.value,
      longitude: lngRef.current.value,
    };
    console.log("Submitted Location Data:", locationData);
    if(locationData.venue === ""){
        ShowToast("Enter venue")
    }
    else if(locationData.latitude === ""){
        ShowToast("Enter latitude")
    }
    else if(locationData.longitude === ""){
        ShowToast("Enter longitude")
    }else{
        try {
            const response = await fetch(`http://localhost:3000/Add/AddLocation`, {
                method: "POST", // Use POST for creating new entries
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vanue: locationData.venue,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
                })
            });
        
            if (response.ok) {
                const data = await response.json();
                // console.log("Location added:", data);
                ShowToast("Location added successfully");
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
                ShowToast(`Failed to add location ${errorText}`);
                throw new Error(`Request failed: ${errorText}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }finally{
            await new Promise(resolve => setTimeout(resolve, 2000));
            // window.location.reload();
        }    
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Location</h2>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Venue</label>
        <input
          ref={venueRef}
          type="text"
          placeholder="Enter venue name"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Latitude</label>
        <input
          ref={latRef}
          type="number"
          placeholder="Enter latitude"
          step="any"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Longitude</label>
        <input
          ref={lngRef}
          type="number"
          placeholder="Enter longitude"
          step="any"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-orange-400 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
      >
        Submit
      </button>
    </div>
  );
}

export default AddLocation;
