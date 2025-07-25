import { useEffect, useState } from "react";
import showToast from "../HomePage/alert"; // Adjust path if needed

function DeleteSchedule() {
    const [allSchedules, setAllSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState("");

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await fetch(`http://localhost:3000/Get/getSchedule`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setAllSchedules(data);
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const deleteSchedule = async (scheduleId) => {
        setSelectedSchedule(scheduleId);
        try {
            const response = await fetch(`http://localhost:3000/Delete/DeleteSchedule`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ scheduleId }),
            });

            if (response.ok) {
                console.log("Schedule deleted successfully");
                showToast(`Schedule deleted successfully`);
                setAllSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
            } else {
                const errorText = await response.text();
                console.error("Failed to delete:", errorText);
                showToast(`Failed to delete schedule`);
            }
        } catch (error) {
            console.error("Delete request failed:", error);
            showToast(`Error deleting schedule`);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg p-6 mt-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Schedule</h2>
            {allSchedules.length === 0 ? (
                <p className="text-gray-600">No schedule available.</p>
            ) : (
                <ul className="space-y-2">
                    {allSchedules.map((schedule) => (
                        <li
                            key={schedule.courseCode}
                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                        >
                            <span className="text-gray-800 font-medium">
                                {schedule.courseCode || "Unknown Course"} - (Section:-{schedule.section || "Unknown Course"})
                            </span>
                            <button
                                onClick={() => deleteSchedule(schedule._id)}
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

export default DeleteSchedule;
