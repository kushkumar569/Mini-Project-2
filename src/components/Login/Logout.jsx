import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    async function logout() {
        try {
            const response = await fetch(`http://localhost:3000/logout`, {
                method: "POST",
                credentials: "include", // Ensures cookies are included in the request
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Logged out successfully!");
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
            <button className="px-4 py-2 bg-orange-400 hover:bg-green-600 font-semibold text-white rounded-xl" onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Logout;
