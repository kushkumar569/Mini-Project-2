import { useRef } from "react";
import ShowToast from "../HomePage/alert.js";

function AddTeacher() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const departmentRef = useRef();

const handleSubmit = async () => {
    const teacherData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      department: departmentRef.current.value,
    };
    console.log("Submitted Teacher Data:", teacherData);
    if(teacherData.name === ""){
        ShowToast("Enter name")
    }
    else if(teacherData.email === ""){
        ShowToast("Enter email")
    }
    else if(!teacherData.email.trim().endsWith("@smvdu.ac.in")){
        ShowToast("Enter valid email");
    }
    else if(teacherData.password === ""){
        ShowToast("Enter password")
    }
    else if(teacherData.department === ""){
        ShowToast("Enter department")
    }else{
        try {
            const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Add/AddTeacher`, {
                method: "POST", // Use POST for creating new entries
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: teacherData.email,
                    password: teacherData.password,
                    name: teacherData.name,
                    department: teacherData.department
                })
            });
        
            if (response.ok) {
                const data = await response.json();
                // console.log("Teacher added:", data);
                ShowToast("Teacher added successfully");
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
                ShowToast(`Failed to add teacher ${errorText}`);
                throw new Error(`Request failed: ${errorText}`);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Teacher</h2>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Name</label>
        <input
          ref={nameRef}
          type="text"
          placeholder="Enter full name"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Email</label>
        <input
          ref={emailRef}
          type="email"
          placeholder="Enter email"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Password</label>
        <input
          ref={passwordRef}
          type="password"
          placeholder="Create password"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Department</label>
        <input
          ref={departmentRef}
          type="text"
          placeholder="Enter department"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default AddTeacher;
