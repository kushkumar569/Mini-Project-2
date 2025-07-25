import { useState, useEffect } from "react";
import showToast from "./alert.js";
import { useNavigate } from "react-router-dom";
// https://mini-project-ii-ypu6.onrender.com

function Main({ cc, cn, sec, date, dep, sem, day, time, isRunning, setIsRunning, numbers, setNumbers }) {
    const [venueOptions, setVenueOptions] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState();
    const [venueChosen, setVenueChosen] = useState(false);

    const [message, setMessage] = useState("process");
    const [isMark, setIsMark] = useState(false);
    const [entryNumber, setEntryNumber] = useState("");
    const [msg, setMsg] = useState("");

    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [live, setLive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        async function vanue() {
            try {
                const response = await fetch(`https://mini-project-2-6a2p.onrender.com/get/getLocation`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const options = data.map(item => item.vanue);
                    setVenueOptions(options);
                    console.log(data);
                    // setVenueOptions(data);
                } else {
                    const errorText = await response.text();
                    console.error("Error Response:", errorText);
                    throw new Error(`Failed to fetch venues: ${errorText}`);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        vanue(); // only once on mount
    }, []);

    async function setTime(latitude, longitude, liveStatus) {
        const now = new Date();
        const times = now.toTimeString().split(" ")[0]; // HH:MM:SS

        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/setData/setTime`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: "67e71052258dbe80e2a60119",
                    TeacherLatitude: Number(latitude),
                    TeacherLongitude: Number(longitude),
                    isLive: Boolean(liveStatus),
                    time: times
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Updated Time:", data);
            } else {
                const errorText = await response.text();
                console.error("Error Response:", errorText);
                throw new Error(`Failed to update Time: ${errorText}`);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function startTimer() {
        if (!venueChosen) {
            showToast("Please choose a venue first.");
            return;
        }

        try {
            setIsMark(true);
            setLive(true);
            setMessage("Attendance Marked Successfully");
            showToast("Attendance Marked Successfully");

            if (!isRunning) {
                await setTime(lat, lon, true);
                setIsRunning(true);
            }
        } catch (error) {
            showToast(error.message || "An error occurred while marking attendance.");
            window.location.reload();
        }
    }

    async function chooseVanue() {
        if (isRunning) {
            showToast("Attendance is running. You can't change venue");
            return;
        }

        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/get/getVanue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ vanue: selectedVenue })
            });

            if (response.ok) {
                const data = await response.json();
                setLat(data.latitude);
                setLon(data.longitude);
                showToast(`Venue selected: ${selectedVenue}`);
                setVenueChosen(true);
            } else {
                const errorText = await response.text();
                showToast("Failed to select venue.");
                setVenueChosen(false);
                console.error("Error Response:", errorText);
            }
        } catch (error) {
            showToast("Failed to select venue.");
            setVenueChosen(false);
            console.error("Error:", error);
        }
    }

    const handleAddNumber = () => {
        const num = Number(entryNumber.trim());

        if (!entryNumber.trim()) {
            setMsg("Input cannot be empty.");
        } else if (isNaN(num)) {
            setMsg("Please enter a valid number.");
        } else if (num < 1 || num > 50) {
            setMsg("Number must be between 1 and 50.");
        } else if (numbers.current.includes(num)) {
            setMsg("Number already exists.");
        } else {
            const updatedNumbers = [...numbers.current, num].sort((a, b) => a - b);
            numbers.current = updatedNumbers;
            setMsg("Number added successfully.");
            setEntryNumber("");
        }
    };

    
    function back(){
        if(isRunning){
            showToast("Attendance is running. You can't go back");
            return;
        }else{
            navigate("/")
        }
    }

    return (
        <div className="flex items-center justify-center md:w-[40%] w-full">
            <div className="relative w-full max-w-5xl bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center mx-auto">

                {/* Venue Selection */}
                <div className="w-full flex flex-col items-center mt-2">
                    <label className="text-gray-800 font-semibold mb-1">Select Venue</label>
                    <select
                        value={selectedVenue}
                        onChange={(e) => setSelectedVenue(e.target.value)}
                        className="w-full px-4 py-2 mb-2 bg-gray-300 font-semibold rounded-md focus:outline-none"
                    >
                        {venueOptions.map((venue, index) => (
                            <option key={index} value={venue}>
                                {venue}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={chooseVanue}
                        className="bg-orange-400 hover:bg-green-600 text-white py-2 px-6 rounded-md font-semibold w-full"
                    >
                        Select
                    </button>
                </div>

                {/* Course Info */}
                <div className="text-gray-800 font-semibold mt-8 text-center space-y-1">
                    <div>Date: <b>{date}</b></div>
                    <div>Semester: <b>{sem}</b></div>
                    <div>Section: <b>{sec}</b></div>
                    <div>Course Code: <b>{cc}</b></div>
                    <div>Course Name: <b>{cn}</b></div>
                </div>

                {/* Start Button */}
                <button
                    className={`${isRunning ? "bg-orange-400" : "bg-green-600"
                        } hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold w-full mt-10`}
                    onClick={startTimer}
                >
                    {isRunning ? "Attendance Running" : "Mark Attendance"}
                </button>

                {/* Manual Entry */}
                <span className="text-gray-800 font-semibold mt-6 mb-2">
                    Mark Attendance Manually
                </span>

                <div className="w-full flex flex-col items-center">
                    <input
                        type="text"
                        value={entryNumber}
                        onChange={(e) => setEntryNumber(e.target.value)}
                        className="w-full px-4 py-2 mb-2 bg-gray-300 font-semibold rounded-md focus:outline-none text-center"
                        placeholder="Entry Number"
                    />
                    <button
                        onClick={live ? handleAddNumber : () => alert("Mark Attendance First")}
                        className="bg-green-600 hover:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold w-full"
                    >
                        Add
                    </button>
                    {msg && <p className="mt-2 text-red-600">{msg}</p>}

                    {numbers.current.length > 0 && (
                        <div className="mt-2 text-black font-semibold text-center">
                            Added Numbers: {numbers.current.join(", ")}
                        </div>
                    )}
                </div>
                <button className="bg-orange-400 hover:bg-green-600 text-white py-2 md:px-5 px-3 rounded-md font-semibold md:w-1/4 w-1/3 my-3" onClick={back}>Back</button>
            </div>
        </div>
    );
}

export default Main;
