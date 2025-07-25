import { useRef } from "react";
import ShowToast from "./HomePage/alert";

function ChangePassword() {
    const oldPasswordRef = useRef();
    const newPasswordRef = useRef();

    async function ChangePass() {
        const token = localStorage.getItem("token");
        const oldPassword = oldPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;

        if (!oldPassword || !newPassword) {
            ShowToast("Both fields are required");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/ChangePassword`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                ShowToast("Password changed successfully");
                oldPasswordRef.current.value = "";
                newPasswordRef.current.value = ""; 
                alert("Password change sucessfull")             
            } else {
                const errorText = await response.text();
                console.error("Server responded with error:", errorText);
                ShowToast(`Failed to change password: ${errorText}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            ShowToast("An error occurred while changing the password");
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                <img
                    src="https://smvdu.ac.in/wp-content/uploads/2023/08/cropped-logo-600-1.png"
                    alt="University Logo"
                    className="w-12 h-12 md:w-20 md:h-20 object-cover rounded-r-2xl"
                />
                <div className="mt-2 md:mt-0 md:ml-4">
                    <div className="text-lg md:text-4xl text-black font-bold">
                        Shri Mata Vaishno Devi University
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-x-2 md:space-y-0 justify-center">
                <input
                    type="password"
                    ref={oldPasswordRef}
                    placeholder="Old Password"
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    ref={newPasswordRef}
                    placeholder="New Password"
                    className="border p-2 rounded"
                />
                <button
                    className="px-4 py-2 bg-orange-400 hover:bg-green-600 text-white rounded-xl"
                    onClick={ChangePass}
                >
                    Change Password
                </button>
            </div>
        </>
    );
}

export default ChangePassword;
