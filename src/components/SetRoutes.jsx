import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./Login/Login";
import  Student  from "./HomePage/Student";
import Admin from "./HomePage/Admin";
import Teacher  from "./HomePage/Teacher";

function SetRoutes() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Student" element={<Student />} />
                    <Route path="/Admin" element={<Admin />} />
                    <Route path="/Teacher" element={<Teacher />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default SetRoutes;