import ChangePassword from "./ChangePassword";
import Logout from "./Login/Logout";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    function changePassword(){
        navigate("/changePassword");
    }
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white px-8 space-y-4 md:space-y-0">
            {/* Left Section: Logo + Title */}
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

            {/* Right Section: Actions */}
            <div className="flex space-x-6">
                <button className="px-2 py-2 bg-orange-400 hover:bg-green-600  text-white rounded-xl md:px-4" onClick={changePassword}>Change Password</button>
                <Logout />
            </div>
        </div>
    )
}

export default Header;