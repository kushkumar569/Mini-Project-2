function Student(){
    return(
        <>
            <div className="bg-white flex mb-30">
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
            <div className="bg-white flex items-center justify-center p-6">
                <div className="relative w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center">
                    <div className="absolute top-1 left-2 flex items-center space-x-1">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span className="text-gray-500 text-lg font-semibold">
                            Geo-Fencing Attendance Manager
                        </span>
                    </div>
                    <button
                        className="bg-green-600 hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold mb-4 w-full mt-16"
                    >
                        Mark Attendence
                    </button>
                </div>
            </div>
        </>
    )
}

export default Student;