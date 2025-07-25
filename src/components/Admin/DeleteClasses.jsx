import { useEffect, useState } from "react";
import showToast from "../HomePage/alert"; // Ensure the path is correct
import { DeleteSchedules } from "./api/DeleteSchedules";

function DeleteClasses() {
    const [allClasses, setAllClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState("");

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch(`http://localhost:3000/Get/getCourseCode`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setAllClasses(data);
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const deleteClass = async (courseCode) => {
        setSelectedClasses(courseCode);
        const arr=[courseCode]
        try {
            const response = await fetch(`http://localhost:3000/Delete/DeleteClass`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseCode }),
            });
            console.log(response);
            
            if (response.ok) {
                console.log("Class deleted successfully");
                showToast(`Class ${courseCode} deleted successfully`);
                setAllClasses(prev => prev.filter(cls => cls.courseCode !== courseCode));
                DeleteSchedules(arr);
            } else {
                const errorText = await response.text();
                console.error("Failed to delete:", errorText);
                showToast(`Failed to delete ${courseCode}`);
            }
        } catch (error) {
            console.error("Delete request failed:", error);
            showToast(`Error deleting ${courseCode}`);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg p-6 mt-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Class</h2>
            {allClasses.length === 0 ? (
                <p className="text-gray-600">No Class available.</p>
            ) : (
                <ul className="space-y-2">
                    {allClasses.map((classes) => (
                        <li
                            key={classes._id}
                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                        >
                            <span className="text-gray-800 font-medium">
                                {classes.courseCode} — {classes.courseName || "No Name"}
                            </span>
                            <button
                                onClick={() => deleteClass(classes.courseCode)}
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

export default DeleteClasses;
