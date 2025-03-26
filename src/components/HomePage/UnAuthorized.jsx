import { useNavigate } from "react-router-dom";
import showToast from "./alert";

function UnAuthorized(){
    const navigate = useNavigate();
    async function logout() {
        try {
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include", // Ensures cookies are included in the request
            });

            const data = await response.json();

            if (response.ok) {
                // showToast(data.message || "Logged out successfully!");
                navigate("/"); // Redirect to login page
            } else {
                throw new Error(data.message || "Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong, please try again.");
        }
    }
    return(
        <div>
            UnAutherize user.<br/>
            <button className="p-2 bg-green-300" onClick={logout}>Login</button>
        </div>
    )
}

export default UnAuthorized;