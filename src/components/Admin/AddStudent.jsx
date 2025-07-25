import { useRef } from "react";
import ShowToast from "../HomePage/alert.js";

function AddStudent() {
    // Define refs for each input field
    const prefixRef = useRef();
    const fromRef = useRef();
    const toRef = useRef();
    const departmentRef = useRef();
    const semesterRef = useRef();
    const sectionRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async () => {
        const data = {
            prefix: prefixRef.current.value,
            from: fromRef.current.value,
            to: toRef.current.value,
            department: departmentRef.current.value,
            semester: semesterRef.current.value,
            section: sectionRef.current.value,
            password: passwordRef.current.value,
        };
        console.log("Submitted Data:", data);
        if(data.prefix === ""){
            ShowToast("Enter prefix")
        }else if(data.from === ""){
            ShowToast("Enter from")
        }else if(data.to === ""){
            ShowToast("Enter to")
        }else if(data.department === ""){
            ShowToast("Enter department")
        }else if(data.semester === ""){
            ShowToast("Enter semester")
        }else if(data.section === ""){
            ShowToast("Enter section")
        }else if(data.password === ""){
            ShowToast("Enter password")
        }else{
            try {
                const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Add/AddStudent`, {
                    method: "POST", // Use POST for creating new entries
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prefix: data.prefix,
                        from: Number(data.from),
                        to: Number(data.to),
                        department: data.department,
                        semester: data.semester,
                        section: data.section,
                        password: data.password
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    ShowToast("Student added successfully");
                } else {
                    const errorText = await response.text();
                    console.error("Server responded with error:", errorText);
                    ShowToast(`Failed to add student ${errorText}`);
                    throw new Error(`Request failed: ${errorText}`);
                }
            }catch(error){
                console.error("Fetch error:", error);
            }finally{
                await new Promise(resolve => setTimeout(resolve, 2000));
                // window.location.reload();
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Student</h2>

            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Prefix</label>
                <input
                    ref={prefixRef}
                    type="text"
                    placeholder="Enter prefix (e.g. 22BCS)"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Roll Number Range</label>
                <div className="flex space-x-4">
                    <input
                        ref={fromRef}
                        type="number"
                        placeholder="From"
                        className="w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        ref={toRef}
                        type="number"
                        placeholder="To"
                        className="w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
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

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-0">
                    <label className="font-medium text-gray-700">Semester</label>
                    <input
                        ref={semesterRef}
                        type="number"
                        placeholder="Semester"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-0">
                    <label className="font-medium text-gray-700">Section</label>
                    <input
                        ref={sectionRef}
                        type="text"
                        placeholder="Section (e.g. A)"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-0">
                <label className="font-medium text-gray-700">Default Password</label>
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Enter default password"
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


export default AddStudent