import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Ids, Date as DateAtom, Time as TimeAtom, Day } from "../atoms/attendence";
import { useNavigate } from "react-router-dom";

function TodayAttendance() {
    const ids = useRecoilValue(Ids);
    const date = useRecoilValue(DateAtom);
    const time = useRecoilValue(TimeAtom);
    const day = useRecoilValue(Day);
    const [todayAttnd, setTodayAttnd] = useState(null);
    const [loading, setLoading] = useState(true);
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
        const fetchClasses = async () => {
            try {
                const response = await fetch(`http://localhost:3000/get/TodayAttendence`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        courseCode: ids,
                        Date: date,
                        Time: time,
                        Day: day,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch today's attendance");
                }

                const data = await response.json();
                setTodayAttnd(data);
            } catch (err) {
                console.error("Error fetching attendance:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [ids, date, time, day]);

    const renderTable = () => {
        if (!Array.isArray(todayAttnd) || todayAttnd.length === 0) {
            return <p className="text-red-500">No attendance data found for today.</p>;
        }

        const tableHeaders = Object.keys(todayAttnd[0]);

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow-sm">
                    <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                        <tr>
                            <th className="py-2 px-4 border-b text-center">EntryNumber</th>
                            {tableHeaders.map((key) => (
                                <th key={key} className="py-2 px-4 border-b text-center capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {todayAttnd.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                                <td className="py-2 px-4 border-b text-center">{student}</td>
                                {tableHeaders.map((key) => (
                                    <td key={key} className="py-2 px-4 border-b text-center">
                                        {student[key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📋 Today's Attendance</h2>

            {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
            ) : (
                <>
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 border border-gray-100">
                        {renderTable()}
                    </div>

                    {Array.isArray(todayAttnd) && (
                        <p className="mt-4 text-green-700 font-semibold text-center">
                            ✅ Total Students Marked Present: {todayAttnd.length}
                        </p>
                    )}
                </>
            )}

            <button
                onClick={() => navigate("/view", { replace: true })}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
            >
                View Total Attendance
            </button>
        </div>
    );
}

export default TodayAttendance;
