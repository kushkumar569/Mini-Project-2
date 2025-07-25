import { useRef } from "react";
import ShowToast from "../HomePage/alert.js";
import showToast from "../HomePage/alert.js";

function DeleteStudent() {
    const prefixRef = useRef();
    const fromRef = useRef();
    const toRef = useRef();

    async function handleSubmit() {
        if (!prefixRef.current.value) {
            showToast("Enter Prefix")
        } else if (!fromRef.current.value) {
            showToast("Enter From")
        } else if (!toRef.current.value) {
            showToast("Enter To")
        } else {
            try {
                const response = await fetch(`http://localhost:3000/Delete/DeleteStudent`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prefix: prefixRef.current.value,
                        from: Number(fromRef.current.value),
                        to: Number(toRef.current.value),
                    }),
                });
                if (response.ok) {
                    showToast("Students Deleted")
                } else {
                    const errorText = await response.text();
                    showToast("Failed to delete");
                    console.error("Failed to delete:", errorText);
                }
            } catch (error) {
                showToast("Failed to delete");
                console.error("Delete request failed:", error);
            }
        }
    }
    return (<>
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6 mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Student</h2>

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
            <button
                onClick={handleSubmit}
                className="mt-2 w-full bg-orange-400 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
                Delete
            </button>
        </div>
    </>)
}

export default DeleteStudent