import { useEffect, useState, useRef } from "react";
import ShowToast from "../HomePage/alert.js";

function AddClasses() {
    const [allTeachers, setAllTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");

    const courseCodeRef = useRef();
    const departmentRef = useRef();
    const semesterRef = useRef();
    const courseNameRef = useRef();

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`http://localhost:3000/Get/getTeacher`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAllTeachers(data);
                } else {
                    const errorText = await response.text();
                    console.error("Server responded with error:", errorText);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchTeachers();
    }, []);

    const handleSubmit = async () => {
        const classData = {
            teacher: selectedTeacher,
            courseCode: courseCodeRef.current.value,
            department: departmentRef.current.value,
            semester: semesterRef.current.value,
            courseName: courseNameRef.current.value,
        };
        console.log(classData);     
        // Validation
        if (!classData.teacher) {
            return ShowToast("Select a teacher");
        } else if (!classData.courseCode) {
            return ShowToast("Enter course code");
        } else if (!classData.department) {
            return ShowToast("Enter department");
        } else if (!classData.semester) {
            return ShowToast("Enter semester");
        } else if (!classData.courseName) {
            return ShowToast("Enter course name");
        }
        else {
            try {
                const response = await fetch(`http://localhost:3000/Add/AddClass`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(classData),
                });

                if (response.ok) {
                    ShowToast("Class added successfully");
                    console.log(response.json());
                    
                } else {
                    const errorText = await response.text();
                    ShowToast(`Failed to add class: ${errorText}`);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }finally{
                await new Promise(resolve => setTimeout(resolve, 2000));
                // window.location.reload();
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Class</h2>

            {/* Dropdown for Teacher */}
            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Select Teacher</label>
                <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select Teacher --</option>
                    {allTeachers.map((teacher, index) => (
                        <option key={index} value={teacher.email}>
                            {teacher.email}
                        </option>
                    ))}
                </select>
            </div>

            {/* Input Fields */}
            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Course Code</label>
                <input
                    ref={courseCodeRef}
                    type="text"
                    placeholder="Enter course code"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Course Name</label>
                <input
                    ref={courseNameRef}
                    type="text"
                    placeholder="Enter course name"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Department</label>
                <input
                    ref={departmentRef}
                    type="text"
                    placeholder="Enter department"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Semester</label>
                <input
                    ref={semesterRef}
                    type="text"
                    placeholder="Enter semester"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="mt-2 w-full bg-orange-400 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
                Submit
            </button>
        </div>
    );
}

export default AddClasses;
