import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/Login";
import Student from "./HomePage/Student";
import Admin from "./HomePage/Admin";
import Teacher from "./HomePage/Teacher";
import View from "./HomePage/View";
import PrivateRoute from "./PrivateRoute";
import UnAuthorized from "./HomePage/UnAuthorized";
import Logout from "./Login/Logout";
import PrivateAuthStudent from "./Auth/PrivateAuthStudent";
import PrivateAuthAdmin from "./Auth/PrivateAuthAdmin";
import PrivateAuthTeacher from "./Auth/PrivateAuthTeacher";

function SetRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/unauthorized" element={<UnAuthorized />} />
                <Route path="/view" element={<View />} />
                <Route path="/" element={<Login />} />
                <Route path="/logout" element={<Logout />} />


                {/* Private Routes for different roles */}
                <Route element={<PrivateAuthStudent allowedRoles="Student" />}>
                    <Route path="/Student" element={<Student />} />
                </Route>

                <Route element={<PrivateAuthAdmin allowedRoles="Admin" />}>
                    <Route path="/Admin" element={<Admin />} />
                </Route>

                <Route element={<PrivateAuthTeacher allowedRoles="Teacher" />}>
                    <Route path="/Teacher" element={<Teacher />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default SetRoutes;
