import { useEffect, useState, useRef } from "react";
import ShowToast from "../HomePage/alert";

function UpdateSchedule() {
    const [allSchedules, setAllSchedules] = useState([]);
    const [selectedCourseCode, setSelectedCourseCode] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [dayList, setDayList] = useState([]);
    const [timeList, setTimeList] = useState([]);
    const sectionRef = useRef();

    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeOptions = [
        "9:00-10:00", "10:00-11:00", "11:00-12:00",
        "12:00-13:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
    ];

    useEffect(() => {
        fetchAllSchedules();
    }, []);

    const fetchAllSchedules = async () => {
        try {
            const res = await fetch(`https://mini-project-2-6a2p.onrender.com/Get/getSchedule`);
            if (res.ok) {
                const data = await res.json();
                // console.log(data);

                // Remove duplicates based on 'id'
                const uniqueData = Array.from(
                    new Map(data.map(item => [item.courseCode, item])).values()
                );
                // console.log(uniqueData);
                
                setAllSchedules(uniqueData);
            } else {
                ShowToast("Failed to fetch schedules");
            }
        } catch (err) {
            console.error("Error fetching schedules:", err);
        }
    };

    const handleCourseCodeSelect = (code) => {
        setSelectedCourseCode(code);
        const schedule = allSchedules.find(sch => sch.courseCode === code);
        if (schedule) {
            sectionRef.current.value = schedule.section;
            setDayList(schedule.day || []);
            setTimeList(schedule.time || []);
        }
    };

    const handleAdd = () => {
        if (!selectedDay || !selectedTime) return;
        setDayList(prev => [...prev, selectedDay]);
        setTimeList(prev => [...prev, selectedTime]);
    };

    const handleDelete = (indexToDelete) => {
        setDayList(prev => prev.filter((_, i) => i !== indexToDelete));
        setTimeList(prev => prev.filter((_, i) => i !== indexToDelete));
    };

    const handleUpdate = async () => {
        const section = sectionRef.current.value.trim();
        if (!selectedCourseCode || !section || dayList.length === 0 || timeList.length === 0) {
            ShowToast("Please fill all fields and add at least one day-time pair.");
            return;
        }

        const selectedSchedule = allSchedules.find(sch => sch.courseCode === selectedCourseCode);
        if (!selectedSchedule) {
            ShowToast("Selected schedule not found.");
            return;
        }

        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Update/updateSchedule`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseCode: selectedSchedule.courseCode,
                    section: section,
                    day: dayList,
                    time: timeList,
                }),
            });

            if (response.ok) {
                ShowToast("Schedule updated successfully");
            } else {
                const errorText = await response.text();
                ShowToast(`Failed to update schedule: ${errorText}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Schedule</h2>

            {/* Course Code */}
            <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700">Select Course Code</label>
                <select
                    value={selectedCourseCode}
                    onChange={(e) => handleCourseCodeSelect(e.target.value)}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="">-- Select Course Code --</option>
                    {allSchedules.map((sched, index) => (
                        <option key={index} value={sched.courseCode}>
                            {sched.courseCode}
                        </option>
                    ))}
                </select>
            </div>

            {/* Section */}
            <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700">Section</label>
                <input
                    ref={sectionRef}
                    type="text"
                    placeholder="Enter section"
                    className="border rounded-md px-3 py-2"
                />
            </div>

            {/* Day & Time Select */}
            <div className="flex flex-col md:flex-row md:items-end gap-2">
                <div className="flex flex-col flex-1 space-y-1">
                    <label className="font-medium text-gray-700">Day</label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="">-- Select Day --</option>
                        {dayOptions.map((day, index) => (
                            <option key={index} value={day}>{day}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col flex-1 space-y-1">
                    <label className="font-medium text-gray-700">Time</label>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="">-- Select Time --</option>
                        {timeOptions.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAdd}
                    className="mt-2 md:mt-5 bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Add
                </button>
            </div>


            {/* Display Day-Time List */}
            {dayList.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Current Schedule:</h3>
                    <ul className="space-y-2">
                        {dayList.map((day, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center border p-2 rounded-md bg-gray-50"
                            >
                                <span>{day} - {timeList[index]}</span>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleUpdate}
                className="mt-4 w-full bg-orange-400 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
                Update
            </button>
        </div>
    );
}

export default UpdateSchedule;
