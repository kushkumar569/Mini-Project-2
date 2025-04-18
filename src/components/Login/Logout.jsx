import { useNavigate } from "react-router-dom";
import showToast from "../HomePage/alert";

function Logout() {
    const navigate = useNavigate();

    async function logout() {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/logout`, {
                method: "POST",
                credentials: "include", // Ensures cookies are included in the request
            });

            const data = await response.json();

            if (response.ok) {
                showToast(data.message || "Logged out successfully!");
                localStorage.removeItem("token");
                navigate("/"); // Redirect to login page
            } else {
                throw new Error(data.message || "Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong, please try again.");
        }
    }

    return (
        <div>
            <button className="p-2 bg-green-500 font-semibold" onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Logout;
