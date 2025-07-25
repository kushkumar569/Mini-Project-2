import { useEffect, useState, useRef } from "react";
import ShowToast from "../HomePage/alert.js";

function UpdateClasses() {
    const [allCourses, setAllCourses] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);

    const [selectedCourseCode, setSelectedCourseCode] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");

    const departmentRef = useRef();
    const semesterRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, teachersRes] = await Promise.all([
                    fetch(`https://mini-project-2-6a2p.onrender.com/Get/getCourseCode`),
                    fetch(`https://mini-project-2-6a2p.onrender.com/Get/getTeacher`),
                ]);

                if (coursesRes.ok && teachersRes.ok) {
                    const courses = await coursesRes.json();
                    const teachers = await teachersRes.json();
                    setAllCourses(courses);
                    setAllTeachers(teachers);
                } else {
                    const error = await coursesRes.text();
                    console.error("Error loading data:", error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCourseCode) {
            const course = allCourses.find(c => c.courseCode === selectedCourseCode);
            if (course) {
                departmentRef.current.value = course.department || "";
                semesterRef.current.value = course.semester || "";
                setSelectedTeacher(course.teacher || "");
            }
        } else {
            departmentRef.current.value = "";
            semesterRef.current.value = "";
            setSelectedTeacher("");
        }
    }, [selectedCourseCode, allCourses]);

    const handleSubmit = async () => {
        const classData = {
            teacher: selectedTeacher,
            courseCode: selectedCourseCode,
            department: departmentRef.current.value,
            semester: semesterRef.current.value,
        };

        if (!classData.courseCode) return ShowToast("Select a course code");
        if (!classData.teacher) return ShowToast("Select a teacher");
        if (!classData.department) return ShowToast("Enter department");
        if (!classData.semester) return ShowToast("Enter semester");

        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Update/updateClass`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(classData),
            });

            if (response.ok) {
                ShowToast("Class updated successfully");
            } else {
                const errorText = await response.text();
                ShowToast(`Failed to update class: ${errorText}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 2000));
            // window.location.reload();
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Class</h2>

            {/* Course Code Dropdown */}
            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Select Course Code</label>
                <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="">-- Select Course Code --</option>
                    {allCourses.map((course, idx) => (
                        <option key={idx} value={course.courseCode}>
                            {course.courseCode}
                        </option>
                    ))}
                </select>
            </div>

            {/* Teacher Dropdown */}
            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Assign Teacher</label>
                <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="">-- Select Teacher --</option>
                    {allTeachers.map((teacher, index) => (
                        <option key={index} value={teacher.email}>
                            {teacher.email}
                        </option>
                    ))}
                </select>
            </div>

            {/* Department */}
            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Department</label>
                <input
                    ref={departmentRef}
                    type="text"
                    className="border rounded-md px-3 py-2"
                    placeholder="Department"
                />
            </div>

            {/* Semester */}
            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Semester</label>
                <input
                    ref={semesterRef}
                    type="text"
                    className="border rounded-md px-3 py-2"
                    placeholder="Semester"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-orange-400 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
                Submit
            </button>
        </div>
    );
}

export default UpdateClasses;
