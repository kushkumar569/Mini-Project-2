import "tailwindcss";
import { useState } from "react";

function Login() {
    const [user, setUser] = useState("Student");

    return (
        <>
            {/* Header */}
            <div className="bg-white flex">
                <img
                    src="https://smvdu.ac.in/wp-content/uploads/2023/08/cropped-logo-600-1.png"
                    alt="Login Illustration"
                    className="w-20 h-20 object-cover rounded-r-2xl ml-4 mt-2"
                />
                <div className="flex flex-col justify-center items-start mt-3 ml-4">
                    <div className="text-black text-4xl font-bold">
                        Shri Mata Vaishno Devi University
                    </div>
                </div>
            </div>

            {/* Login Container */}
            <div className="bg-white flex items-center justify-center mt-10">
                <div className="relative w-[75%] h-[75%] bg-gray-200 rounded-2xl shadow-lg flex">

                    {/* Logo and Title */}
                    <div className="absolute top-1 left-2 flex items-center space-x-1">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span className="text-gray-500 text-lg font-semibold">
                            Geo-Fencing Attendance Manager
                        </span>
                    </div>

                    {/* Left Side - Login Section */}
                    <div className="w-1/2 flex flex-col justify-center items-start px-12 text-black">
                        <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
                        <p className="text-gray-500 font-semibold mb-6">Please log in to continue</p>

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 mb-4 bg-gray-300 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 mb-4 bg-gray-300 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button className="w-full bg-green-600 hover:bg-orange-400 text-white py-2 rounded-md font-semibold">
                            Login
                        </button>

                        {/* Centered "Login as" Text */}
                        <div className="w-full flex justify-center mt-4">
                            <span className="text-gray-500 font-semibold">Login as</span>
                        </div>

                        {/* Left Aligned Buttons with Dynamic Background Colors */}
                        <div className="flex w-full justify-start space-x-9.5 mt-4">
                            <button
                                className={`px-10 py-2 rounded-md font-semibold text-white ${user === "Student" ? "bg-orange-400" : "bg-green-600 hover:bg-orange-400"}`}
                                onClick={() => setUser("Student")}
                            >
                                Student
                            </button>
                            <button
                                className={`px-10 py-2 rounded-md font-semibold text-white ${user === "Teacher" ? "bg-orange-400" : "bg-green-600 hover:bg-orange-400"}`}
                                onClick={() => setUser("Teacher")}
                            >
                                Teacher
                            </button>
                            <button
                                className={`px-10 py-2 rounded-md font-semibold text-white ${user === "Admin" ? "bg-orange-400" : "bg-green-600 hover:bg-orange-400"}`}
                                onClick={() => setUser("Admin")}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-1/2">
                        <img
                            src="/logo.png"
                            alt="Login Illustration"
                            className="w-full h-full object-cover rounded-r-2xl"
                        />
                    </div>

                </div>
            </div>
        </>
    );
};

export default Login;
