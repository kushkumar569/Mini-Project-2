import "tailwindcss";
import { useState } from "react";
function Login() {
    return (
        <>
            <div className="h-screen w-full bg-black flex items-center justify-center">
                {/* Main Container */}
                <div className="relative w-[75%] h-[75%] bg-gray-900 rounded-2xl shadow-lg flex">

                    {/* Logo and Title - Aligned at Top Left */}
                    <div className="absolute top-1 left-2 flex items-center space-x-3">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span className="text-gray-400 text-lg font-semibold">
                            Geo-Fencing Attendance Manager
                        </span>
                    </div>

                    {/* Left Side - Login Section */}
                    <div className="w-1/2 flex flex-col justify-center items-start px-12 text-white">
                        <h2 className="text-3xl font-semibold mb-6">Welcome Back</h2>
                        <p className="text-gray-400 mb-6">Please log in to continue</p>

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 mb-4 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 mb-4 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                            Login
                        </button>

                        <p className="text-sm text-gray-400 mt-4">
                            Don't have an account? <a href="#" className="text-blue-500">Sign Up</a>
                        </p>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-1/2">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/000/311/573/original/world-globe-on-a-blue-background-vector-illustration.jpg"
                            alt="Login Illustration"
                            className="w-full h-full object-cover rounded-r-2xl"
                        />
                    </div>

                </div>
            </div>
        </>
    );
};

export default Login