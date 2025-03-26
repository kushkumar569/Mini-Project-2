import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { TeacherLatitude, TeacherLongitude } from "../atoms/location";
import { live, Attend, time as timeAtom } from "../atoms/attendence";
import { courseCode, courseName, date, section } from "../atoms/detail";
import Header from "../Header";
import { useState, useEffect } from "react";
import showToast from "./alert";
import Logout from "../Login/Logout";
import { time } from "motion";
import { useNavigate } from "react-router-dom";

function Student() {
    const [view,setView] = useState(false);
    const live2 = useRecoilValue(live);
    console.log(live2);
    
    return (
        <>
            <Header />
            {live2 ? <Timer setView={setView}/> : null}
            {view ? <View/> :<Main />}
            <Logout/>
        </>
    );
}

function Timer({setView}) {
    const navigate = useNavigate();
    const time = useRecoilValue(timeAtom); // Stored time in "hh:mm:ss" format
    const [difference, setDifference] = useState(0);
    const [timee, setTimee] = useState(20); // Default 5 min countdown

    // Calculate absolute time difference
    useEffect(() => {
        if (!time) return;

        function getAbsoluteTimeDifferenceInSeconds(t1, t2) {
            const [h1, m1, s1] = t1.split(":").map(Number);
            const [h2, m2, s2] = t2.split(":").map(Number);

            const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
            const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;

            return Math.abs(totalSeconds1 - totalSeconds2); // Absolute difference in seconds
        }

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        const diff = getAbsoluteTimeDifferenceInSeconds(currentTime, time);
        setDifference(diff);
        setTimee(20 - diff); // Start with (5 min - difference)
    }, [time]);

    // Countdown timer
    useEffect(() => {
        let timer;
        if (timee > 0) {
            timer = setInterval(() => {
                setTimee(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        navigate("/view")
                        // setView(true)
                        showToast("Time Over"); // Use alert if showToast is undefined
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timee]); // Restart effect if `timee` updates

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return (
        <div className="text-lg font-bold text-gray-800">
            Time Remaining: {formatTime(timee)}
        </div>
    );
}


function Main() {
    const setAttendence = useSetRecoilState(Attend);
    const live2 = useRecoilValue(live);
    const attend = useRecoilValue(Attend);
    const [numbers, setNumbers] = useState(attend);

    const latTeacher = useRecoilValue(TeacherLatitude);
    const lonTeacher = useRecoilValue(TeacherLongitude);

    const [underRange, setUnderRange] = useState(false);
    const [isFind, setIsFind] = useState(false);
    const [message, setMessage] = useState("");
    const [mark, setMark] = useState(false);

    useEffect(() => {
        async function location() {
            let lat = null;
            let lon = null;

            async function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(await showPosition, await showError);
                } else {
                    setIsFind(false);
                    setMark(false);
                }
            }

            async function showPosition(position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                setIsFind(true);

                const distance = await vincenty(latTeacher, lonTeacher, lat, lon);
                console.log(distance);

                if (distance <= 1000) {
                    setUnderRange(true);
                    setMessage("Inside Range - Present");
                } else {
                    setUnderRange(false);
                    setMessage("Out of Range");
                    setMark(false); // Reset mark if out of range
                }
            }

            function showError(error) {
                setIsFind(false);
                setMark(false);
                setMessage("Failed to fetch location, Turn On GPS and Try Again.");
            }

            await getLocation();
        }

        location();
    }, [latTeacher, lonTeacher]);

    async function vincenty(lat1, lon1, lat2, lon2) {
        const a = 6378137; // semi-major axis (meters)
        const f = 1 / 298.257223563; // flattening
        const b = (1 - f) * a;

        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const L = (lon2 - lon1) * Math.PI / 180;

        const tanU1 = (1 - f) * Math.tan(φ1);
        const tanU2 = (1 - f) * Math.tan(φ2);

        const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
        const sinU1 = tanU1 * cosU1;
        const cosU2 = 1 / Math.sqrt(1 + tanU2 * tanU2);
        const sinU2 = tanU2 * cosU2;

        let λ = L;
        let sinσ, cosσ, σ, sinα, cos2α, cos2σm, C, sinλ, cosλ;

        let iterLimit = 1000;
        while (iterLimit-- > 0) {
            sinλ = Math.sin(λ);
            cosλ = Math.cos(λ);
            sinσ = Math.sqrt((cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ));
            cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
            σ = Math.atan2(sinσ, cosσ);
            sinα = cosU1 * cosU2 * sinλ / sinσ;
            cos2α = 1 - sinα * sinα;
            cos2σm = cosσ - 2 * sinU1 * sinU2 / cos2α;
            C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α));
            λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));

            if (Math.abs(λ - L) < 1e-12) break;
        }

        const u2 = cos2α * (a * a - b * b) / (b * b);
        const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
        const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));

        const Δσ = B * sinσ * (cos2σm + B / 4 * (cosσ * (-1 + 2 * cos2σm * cos2σm) - B / 6 * cos2σm * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σm * cos2σm)));

        return b * A * (σ - Δσ);
    }

    return (
        <div className="bg-white flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center">
                <div className="absolute top-1 left-2 flex items-center space-x-1">
                    <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                    <span className="text-gray-500 text-lg font-semibold">
                        Geo-Fencing Attendance Manager
                    </span>
                </div>
                <div className="mt-8 text-center">
                    {underRange && live2 ? (!mark ? <Btn setMark={setMark} /> : <View mark={mark} />) : (<Error msg={message} live2={live2} />)}
                </div>
            </div>
        </div>
    );
}

function Btn({ setMark }) {
    const navigate = useNavigate();
    const cc = useRecoilValue(courseCode);
    const cn = useRecoilValue(courseName);
    const dates = useRecoilValue(date);
    const sec = useRecoilValue(section)

    const setAttendence = useSetRecoilState(Attend);
    const attend = useRecoilValue(Attend);

    function mark() {
        const updatedNumbers = Array.from(new Set([...attend, 16])).sort((a, b) => a - b);
        setAttendence(updatedNumbers);
        console.log("Updated Attendance:", updatedNumbers);
        setMark(true);
        showToast("Marked Attendance")
        navigate("/view")
    }

    return (
        <div>
            <div className="font-bold">
                <span>CouseCode:-{cc}</span><br />
                <span>CouseName:-{cn}</span><br />
                <span>date:-{dates}</span><br />
                <span>section:-{sec}</span><br />
            </div>
            <button
                className="bg-green-600 hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold mb-4 w-full mt-16"
                onClick={mark}
            >
                Mark Attendance
            </button>
        </div>
    );
}

function Error({ msg, live2 }) {
    return (
        <span className="text-red-600 font-semibold">
            {live2 ? msg : "No Classes"}<br />
            <View />
        </span>
    );
}

function View({ mark }) {
    return (
        <>
            {mark && <Success />}
            <button className="bg-green-600 hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold mb-4 w-full mt-16">
                View Attendance
            </button>
        </>
    );
}

function Success() {
    return (
        <span className="text-red-600 font-semibold">
            Thank You, Your Attendance is Marked ✅.
        </span>
    )
}

export default Student;
