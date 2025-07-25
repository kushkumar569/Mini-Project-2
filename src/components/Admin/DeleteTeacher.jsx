import { useEffect, useState } from "react";
import showToast from "../HomePage/alert.js";
import { DeleteSchedules } from "./api/DeleteSchedules.jsx";
function DeleteTeacher() {
    const [allTeacher, setAllTeacher] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    // const [allcourseCode,setAllCourseCode] = useState([]);

    useEffect(() => {
        fetchTeacher();
    }, []);

    const fetchTeacher = async () => {
        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Get/getTeacher`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllTeacher(data);
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleDelete = async (email) => {
        setSelectedTeacher(email);
        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Delete/DeleteTeacher`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
    
            if (response.ok) {
                console.log("Teacher's Account deleted successfully")          
                showToast(`Teacher's ${email} deleted successfully`);
                setAllTeacher((prev) => prev.filter(tchr => tchr.email !== email));
                await deleteClass(email)
            } else {
                const errorText = await response.text();
                console.error("Failed to delete:", errorText);
                showToast(`Failed to delete ${email}`);
            }
        } catch (error) {
            console.error("Delete request failed:", error);
        }
    };
    
    const deleteClass = async (email) => {
        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Delete/DeleteTeacherClass`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                const data = await response.json(); 
                console.log("Deleted courseCodes:", data.courseCodes);
                DeleteSchedules(data.courseCodes)
            } else {
                const errorText = await response.text();
                console.error("Failed to delete:", errorText);
            }
        } catch (error) {
            console.error("Delete request failed:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg p-6 mt-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Teacher Account</h2>
            {allTeacher.length === 0 ? (
                <p className="text-gray-600">No Teacher's accounts available.</p>
            ) : (
                <ul className="space-y-2">
                    {allTeacher.map((teacher) => (
                        <li
                            key={teacher.email}
                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                        >
                            <span className="text-gray-800 font-medium">{teacher.email}</span>
                            <button
                                onClick={() => handleDelete(teacher.email)}
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

export default DeleteTeacher