import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { TeacherLatitude, TeacherLongitude } from "../atoms/location";

function Teacher() {
    const [time, setTime] = useState(5 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("process");
    const [isMark, setIsMark] = useState(false);
    const [entryNumber, setEntryNumber] = useState("");
    const [numbers, setNumbers] = useState([]);
    const [msg, setMsg] = useState("");

    let lat = null;
    let lon = null;

    const setLat = useSetRecoilState(TeacherLatitude);
    const setLon = useSetRecoilState(TeacherLongitude);

    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(timer);
    }, [isRunning, time]);

    function getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLat(position.coords.latitude);
                        setLon(position.coords.longitude);
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;
                        // setMessage("Attendance Marked Successfully");
                        setIsMark(true);
                        resolve(true);
                    },
                    (error) => {
                        let errorMessage;
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = "User denied the request for Geolocation.";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = "Location information is unavailable. Turn on GPS/Location";
                                break;
                            case error.TIMEOUT:
                                errorMessage = "The request to get user location timed out.";
                                break;
                            default:
                                errorMessage = "An unknown error occurred.";
                        }
                        // setMessage(errorMessage);
                        setIsMark(false);
                        reject(false);
                    }
                );
            } else {
                // setMessage("Geolocation is not supported by this browser.");
                setIsMark(false);
                reject(false);
            }
        });
    }

    async function startTimer() {
        try {
            const marked = await getLocation();
            const newMessage = marked ? "Attendance Marked Successfully" : "Attendance not Marked, Page Refresh";

            setMessage(newMessage); // Update state for future UI updates

            setTimeout(() => {
                alert(newMessage); // Use local variable to ensure correct message
                if (marked) {
                    if (!isRunning) {
                        console.log(`${lat}  ${lon}`);
                        setIsRunning(true);
                    }
                } else {
                    window.location.reload();
                }
            }, 100); // Small delay to ensure state updates before next logic runs
        } catch {
            alert("An error occurred while marking attendance.");
            window.location.reload();
        }
    }


    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }


    const handleAddNumber = () => {
        const num = Number(entryNumber.trim());

        if (!entryNumber.trim()) {
            setMsg("Input cannot be empty.");
        } else if (isNaN(num)) {
            setMsg("Please enter a valid number.");
        } else if (num < 1 || num > 50) {
            setMsg("Number must be between 1 and 50.");
        } else {
            setNumbers([...numbers, num]); // Add to array
            setMsg("Number added successfully.");
            setEntryNumber(""); // Clear input field
        }
    };

    return (
        <>
            <div className="bg-white flex mb-30">
                <img
                    src="https://smvdu.ac.in/wp-content/uploads/2023/08/cropped-logo-600-1.png"
                    alt="Login Illustration"
                    className="w-20 h-20 object-cover rounded-r-2xl ml-4 mt-2"
                />
                <div className="flex flex-col justify-center items-start mt-3 ml-4">
                    <div className="text-black text-4xl font-bold">
                        Shri Mata Vaishno Devi University
                    </div>
                </div>
            </div>
            <div className="bg-white flex items-center justify-center p-6">
                <div className="relative w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center">
                    <div className="absolute top-1 left-2 flex items-center space-x-1">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span className="text-gray-500 text-lg font-semibold">
                            Geo-Fencing Attendance Manager
                        </span>
                    </div>
                    <button
                        className={`${isRunning ? "bg-orange-400" : "bg-green-600"} hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold mb-4 w-full mt-16`}
                        onClick={startTimer}
                    >
                        {isRunning ? `Time Running: ${formatTime(time)}` : "Mark Attendance"}
                    </button>
                    <span className="text-gray-800 font-semibold mb-3">Mark Attendance Manually</span>
                    <div className="w-full flex flex-col items-center">
                        <input
                            type="text"
                            value={entryNumber}
                            onChange={(e) => setEntryNumber(e.target.value)}
                            className="w-full px-4 py-2 mb-2 bg-gray-300 font-semibold rounded-md focus:outline-none text-center"
                            placeholder="Entry Number"
                        />
                        <button
                            onClick={handleAddNumber}
                            className="bg-green-600 hover:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold w-full"
                        >
                            Add
                        </button>
                        {msg && <p className="mt-2 text-red-600">{msg}</p>} {/* Display Message */}
                        <div className="mt-2 text-black font-semibold">
                            {numbers.length > 0 && <p>Added Numbers: {numbers.join(", ")}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Teacher;
