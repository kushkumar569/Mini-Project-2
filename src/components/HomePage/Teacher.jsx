import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue, RecoilRoot } from "recoil";
import { TeacherLatitude, TeacherLongitude } from "../atoms/location";
import { account, courseCode, courseName, semester, department, section, date, day, time } from "../atoms/detail.js";
import { live, Attend } from '../atoms/attendence'
import Header from "../Header";

function Teacher() {
    const [isClass, setIsClass] = useState(false);
    const [msg, setMsg] = useState("");
    const email = useRecoilValue(account)
    const setCC = useSetRecoilState(courseCode);
    const setCN = useSetRecoilState(courseName);
    const setSem = useSetRecoilState(semester);
    const setDep = useSetRecoilState(department);
    const setSec = useSetRecoilState(section);
    const setDate = useSetRecoilState(date);
    const setDay = useSetRecoilState(day);
    const setTime = useSetRecoilState(time);

    const cc = useRecoilValue(courseCode);
    const cn = useRecoilValue(courseName);


    useEffect(() => {
        console.log("Recoil Course Code:", cc);
        console.log("Recoil Course Name:", cn);
    }, [cc, cn]); // Runs whenever cc or cn changes

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch("http://localhost:3000/class/data", {
                    method: "POST", // Since req.body is used in the backend
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email }) // Send email in request body
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch schedule");
                    setIsClass(false);
                    setMsg("There are no class At that time")
                }
                const data = await response.json();
                const use = data.matchedClasses[0];
                await set();
                function set() {
                    setIsClass(true);
                    setMsg("Class");
                    console.log(use);

                    setCC(use.courseCode);
                    setCN(use.courseName);
                    setSem(use.semester);
                    setDep(use.department);
                    setSec(use.section);
                    setDate(use.date);
                    setDay(use.day);
                    setTime(use.time);
                }


                // setSchedule(data); // Store schedule in state
            } catch (error) {
                console.error("Error fetching schedule:", error);
                setMsg("Error fetching schedule:", error);
                setIsClass(false);
            }
        };

        fetchSchedule();
    }, [email]); // Fetch data whenever email changes
    return (
        <>
            <Header />
            {isClass ? (<RecoilRoot>
                <Main />
            </RecoilRoot>) : <NoClass msg={msg} />}
        </>
    );
}

function Main() {
    const [time, setTime] = useState(5 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("process");
    const [isMark, setIsMark] = useState(false);
    const [entryNumber, setEntryNumber] = useState("");
    const attend = useRecoilValue(Attend);
    const [numbers, setNumbers] = useState(attend);
    const [msg, setMsg] = useState("");

    const lat = useRecoilValue(TeacherLatitude);
    const lon = useRecoilValue(TeacherLongitude);
    const setLat = useSetRecoilState(TeacherLatitude);
    const setLon = useSetRecoilState(TeacherLongitude);

    const setliveAttendence = useSetRecoilState(live);
    const setAttendence = useSetRecoilState(Attend);
    const live2 = useRecoilValue(live);

    const cc = useRecoilValue(courseCode);
    const cn = useRecoilValue(courseName)

    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setliveAttendence(false);
            setLat(0.0);
            setLon(0.0);
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
                        setliveAttendence(true);
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
        } else if (numbers.includes(num)) {
            setMsg("Number already exists.");
        } else {
            const updatedNumbers = [...numbers, num].sort((a, b) => a - b);
            setNumbers(updatedNumbers);
            setAttendence(updatedNumbers);
            setMsg("Number added successfully.");
            setEntryNumber(""); // Clear input field
        }
    };

    return (
        <>
            {/* <div>{lat} {lon}</div> */}
            <div>{cc} and {cn}</div>
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
                            onClick={live2 == true ? handleAddNumber : () => { alert("Mark Attendence First") }}
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
    )
}

function NoClass({ msg }) {
    return (
        <>
            {msg}
        </>
    )
}

export default Teacher;
