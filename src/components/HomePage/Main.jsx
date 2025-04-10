import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue, RecoilRoot } from "recoil";
import { TeacherLatitude, TeacherLongitude } from "../atoms/location";
import { account, courseCode, courseName, semester, department, section, date, day } from "../atoms/detail.js";
import { live, Attend, time as timeAtom } from '../atoms/attendence';
import showToast from "./alert.js";


function Main({ cc, cn, sec, date, isRunning, setIsRunning }) {
    const setliveAttendence = useSetRecoilState(live);
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

    const setAttendence = useSetRecoilState(Attend);
    const live2 = useRecoilValue(live);

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
                        setIsMark(false);
                        reject(false);
                    }
                );
            } else {
                setIsMark(false);
                reject(false);
            }
        });
    }

    async function startTimer() {
        try {
            const marked = await getLocation();
            const newMessage = marked ? "Attendance Marked Successfully" : "Attendance not Marked, Page Refresh";

            setMessage(newMessage);

            setTimeout(() => {
                showToast(newMessage)
                if (marked) {
                    if (!isRunning) {
                        setliveAttendence(true);
                        setIsRunning(true);
                    }
                } else {
                    window.location.reload();
                }
            }, 100);
        } catch {
            showToast("An error occurred while marking attendance.");
            window.location.reload();
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
        } else if (numbers.includes(num)) {
            setMsg("Number already exists.");
        } else {
            const updatedNumbers = [...numbers, num].sort((a, b) => a - b);
            setNumbers(updatedNumbers);
            setAttendence(updatedNumbers);
            setMsg("Number added successfully.");
            setEntryNumber("");
        }
    };

    return (
        <>
            <div className="bg-white flex items-center justify-center p-6">
                <div className="relative w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center">
                    <div className="absolute top-1 left-2 flex items-center space-x-1">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span className="text-gray-500 text-lg font-semibold">
                            Geo-Fencing Attendance Manager
                        </span>
                    </div>
                    <div className="text-gray-800 font-semibold mt-8">
                        <span>Date: {date}</span><br />
                        <span>Section: {sec}</span><br />
                        <span>Course Code: {cc}</span><br />
                        <span>Course Name: {cn}</span><br />
                    </div>
                    <button
                        className={`${isRunning ? "bg-orange-400" : "bg-green-600"} hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold mb-4 w-full mt-16`}
                        onClick={startTimer}
                    >
                        {isRunning ? `Start Attendance` : "Mark Attendance"}
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
                            onClick={live2 ? handleAddNumber : () => { alert("Mark Attendance First") }}
                            className="bg-green-600 hover:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold w-full"
                        >
                            Add
                        </button>
                        {msg && <p className="mt-2 text-red-600">{msg}</p>}
                        <div className="mt-2 text-black font-semibold">
                            {numbers.length > 0 && <p>Added Numbers: {numbers.join(", ")}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;