import { useEffect, useRef, useState } from "react";
import ShowToast from "../HomePage/alert.js";

function UpdateTeacher() {
  const [allTeachers, setAllTeachers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");

  const nameRef = useRef();
  const departmentRef = useRef();

  useEffect(() => {
    fetchTeachers();
  }, []);

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
        console.error("Error fetching teachers:", errorText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleUpdate = async () => {
    const name = nameRef.current.value.trim();
    const department = departmentRef.current.value.trim();

    if (!selectedEmail) {
      ShowToast("Please select an email.");
      return;
    }
    if (!name) {
      ShowToast("Please enter a name.");
      return;
    }
    if (!department) {
      ShowToast("Please enter a department.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/Update/updateTeacher`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedEmail,
          name,
          department,
        }),
      });

      if (response.ok) {
        ShowToast("Teacher updated successfully.");
        nameRef.current.value = "";
        departmentRef.current.value = "";
        setSelectedEmail("");
      } else {
        const errorText = await response.text();
        console.error("Update error:", errorText);
        ShowToast(`Failed to update teacher: ${errorText}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      ShowToast("Network error while updating teacher.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Teacher</h2>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Select Email</label>
        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose an email --</option>
          {allTeachers.map((teacher) => (
            <option key={teacher._id} value={teacher.email}>
              {teacher.email}
            </option>
          ))}
        </select>
      </div>

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
        <label className="font-medium text-gray-700">Department</label>
        <input
          ref={departmentRef}
          type="text"
          placeholder="Enter department"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 w-full bg-orange-400 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
      >
        Update
      </button>
    </div>
  );
}

export default UpdateTeacher;
