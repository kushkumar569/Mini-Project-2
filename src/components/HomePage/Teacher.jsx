import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue, RecoilRoot } from "recoil";
import { TeacherLatitude, TeacherLongitude } from "../atoms/location";
import { account, courseCode, courseName, semester, department, section, date, day } from "../atoms/detail.js";
import { live, Attend, time as timeAtom } from '../atoms/attendence';
import Header from "../Header";
import Main from "./Main.jsx"
import showToast from "./alert.js";
import Logout from "../Login/Logout.jsx";
import { useNavigate } from "react-router-dom";

function Teacher() {

    const navigate = useNavigate();

    // Auto-Login Check
    useEffect(() => {
        fetch("http://localhost:3000/me", {
            method: "GET",
            credentials: "include", // Ensures cookies are sent
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    navigate(`/${data.user.role.toLowerCase()}`);
                }
            })
            .catch((error) => console.error("Auto-login failed:", error));
    }, [navigate]);

    const [isRunning, setIsRunning] = useState(false);
    const [isClass, setIsClass] = useState(false);
    const [msg, setMsg] = useState("");
    const [showMain, setShowMain] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [view,setView] = useState(false);
    const email = useRecoilValue(account);

    useEffect(() => {
        setView(false);
    }, []);

    const setCC = useSetRecoilState(courseCode);
    const setCN = useSetRecoilState(courseName);
    const setSem = useSetRecoilState(semester);
    const setDep = useSetRecoilState(department);
    const setSec = useSetRecoilState(section);
    const setDate = useSetRecoilState(date);
    const setDay = useSetRecoilState(day);
    const setTime = useSetRecoilState(timeAtom);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch("http://localhost:3000/class/data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    setIsClass(false);
                    setShowMain(false);
                    return;
                }


                const data = await response.json();
                const use = data.matchedClasses[0];
                if (data.matchedClasses.length == 0) {
                    console.log(data);
                    setMsg("There are no classes at this time");
                    setIsClass(false);
                    setShowMain(false);
                }
                else {
                    setIsClass(true);
                    setShowMain(true);
                    setMsg("Class");
                    console.log(use);

                    setCC(use.courseCode);
                    setCN(use.courseName);
                    setSem(use.semester);
                    setDep(use.department);
                    setSec(use.section);
                    setDate(use.formattedDate);
                    setDay(use.day);
                    setTime(use.time);

                    setSelectedCourse({
                        cc: use.courseCode,
                        cn: use.courseName,
                        sec: use.section,
                        date: use.formattedDate,
                    });
                }

            } catch (error) {
                console.error("Error fetching schedule:", error);
                setMsg("Error fetching schedule");
                setIsClass(false);
                setShowMain(false);
            }
        };

        fetchSchedule();
    }, [email]);
    return (
        <>
            <Header />
            {isRunning && <Time isRunning={isRunning} setIsRunning={setIsRunning} setShowMain={setShowMain} setView={setView}/>}
            
            {view ? (
                <View />
            ) : showMain ? (
                <RecoilRoot>
                    <Main {...selectedCourse} isRunning={isRunning} setIsRunning={setIsRunning} />
                </RecoilRoot>
            ) : (
                <NoClass msg={msg} setShowMain={setShowMain} setSelectedCourse={setSelectedCourse} />
            )}
            <Logout/>
        </>
    );
    
}

function View(){
    return(
        <>
            View Excel
        </>
    )
}



function NoClass({ msg,setShowMain,setSelectedCourse }) {
    const email = useRecoilValue(account);
    const [find, setFind] = useState(false);
    const [classes, setClasses] = useState([]); // Store fetched classes

    async function FindClass() {
        try {
            const response = await fetch("http://localhost:3000/class/extra", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                console.error("Failed to fetch extra classes");
                setFind(false);
                return;
            }

            const data = await response.json();
            console.log("Extra Classes:", data.Classes);
            setClasses(data.Classes); // Store classes in state
            setFind(true);

        } catch (error) {
            setFind(false);
            console.error("Error fetching schedule:", error);
        }
    }

    return (
        <div className="bg-white flex items-start justify-center">
            <div className="w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center space-y-4">
                { !find ? <span>{msg}</span> : null }

                { !find ? (
                    <button 
                        className="bg-green-600 hover:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold w-full" 
                        onClick={FindClass}
                    >
                        Extra Class/Reschedule
                    </button>
                ) : (
                    <div className="flex flex-row flex-wrap gap-4 justify-center">
                        {classes.map((course, index) => (
                            <Extra key={index} course={course} setShowMain={setShowMain} setSelectedCourse={setSelectedCourse} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Extra({ course, setShowMain, setSelectedCourse }) {
    const [sect, setSect] = useState("A"); // Default section

    const setCC = useSetRecoilState(courseCode);
    const setCN = useSetRecoilState(courseName);
    const setSem = useSetRecoilState(semester);
    const setDep = useSetRecoilState(department);
    const setSec = useSetRecoilState(section);
    const setDate = useSetRecoilState(date);
    const setDay = useSetRecoilState(day);
    const setTime = useSetRecoilState(timeAtom);

    let days=null
    let time=null
    let formattedDate=null

    function find(){
        const now = new Date();

        const dayss = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        days = dayss[now.getDay()]; // Current day (Sunday, Monday, etc.)

        // Time in 24-hour format (HH:MM:SS)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        time = `${hours}:${minutes}:${seconds}`;

        const date = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = now.getFullYear();
        formattedDate = `${date}/${month}/${year}`;

        setCC(course.courseCode);
        setCN(course.courseName);
        setSem(course.semester);
        setDep(course.department);
        setSec(sect);
        setDate(formattedDate);
        setDay(days);
        setTime(time);

        setSelectedCourse({
            cc: course.courseCode,
            cn: course.courseName,
            sec: sect,
            date: formattedDate,
        });

        setShowMain(true);
    }
    return (
        <div className="bg-gray-300 p-4 rounded-lg shadow-md text-center w-64">
            <h2 className="text-lg font-bold">{course.courseName}</h2>
            <p><strong>Code:</strong> {course.courseCode}</p>
            <p><strong>Semester:</strong> {course.semester}</p>
            <p><strong>Department:</strong> {course.department}</p>

            {/* Inline Section Dropdown */}
            <div className="flex justify-center items-center gap-2 mt-2">
                <label className="text-lg font-bold">Section:</label>
                <select
                    className="pl-2 pr-2 border rounded-md bg-white"
                    value={sect}
                    onChange={(e) => setSect(e.target.value)}
                >
                    <option value="A">A</option>
                </select>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-2 rounded-md font-semibold" onClick={find}>
                Choose Course
            </button>
        </div>
    );
}

function Time({ isRunning, setIsRunning, setShowMain,setView }) {
    const navigate = useNavigate();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const times = `${hours}:${minutes}:${seconds}`;

    const [timee, setTimee] = useState(1 * 30);
    const t = useRecoilValue(timeAtom);
    const setLiveAttendance = useSetRecoilState(live);
    const setLat = useSetRecoilState(TeacherLatitude);
    const setLon = useSetRecoilState(TeacherLongitude);

    const setCC = useSetRecoilState(courseCode);
    const setCN = useSetRecoilState(courseName);
    const setSem = useSetRecoilState(semester);
    const setDep = useSetRecoilState(department);
    const setSec = useSetRecoilState(section);
    const setDate = useSetRecoilState(date);
    const setDay = useSetRecoilState(day);
    const setTime = useSetRecoilState(timeAtom);

    useEffect(() => {
        // console.log(t); 
    }, [t])

    useEffect(() => {
        let timer;
        if (isRunning && timee > 0) {
            setTime(times);
            timer = setInterval(() => {
                setTimee(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setLiveAttendance(false);
                        setLat(0.0);
                        setLon(0.0);
                        setIsRunning(false);
                        setShowMain(false);
                        setView(true);

                        setCC("");
                        setCN("");
                        setSem("");
                        setDep("");
                        setSec("");
                        setDate("");
                        setDay("");
                        setTime("");
                        showToast("Time Over")
                        navigate('/view')
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, setLiveAttendance, setIsRunning, setLat, setLon]);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return timee > 0 ? <div className="text-lg font-bold text-gray-800">Time Remaining: {formatTime(timee)}</div> : null;
}

export default Teacher;
