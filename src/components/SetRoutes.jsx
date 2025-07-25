import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./Login/Login";
import Student from "./HomePage/Student";
import Admin from "./Admin/Admin";
import Teacher from "./HomePage/Teacher";
import View from "./HomePage/View";
import PrivateRoute from "./PrivateRoute";
import { Navigate } from "react-router-dom";
import UnAuthorized from "./HomePage/UnAuthorized";
import TodayAttendence from "./HomePage/TodayAttendence";   
import Logout from "./Login/Logout";
import TodaySchedule from "./HomePage/TodaySchedule";
import ChangePassword from "./ChangePassword";
import Main from "./HomePage/Main";

function SetRoutes() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/Main" element={<Main />} />
                    <Route path="/changePassword" element={<ChangePassword />} />
                    <Route path="/TodaySchedule" element={<TodaySchedule />}/>
                    <Route path="/TodayAttendence" element={<TodayAttendence />}/>
                    <Route path="/unauthorized" element={<UnAuthorized />} />
                    <Route path="/view" element={<View />} />
                    <Route path="/" element={<Login />} />
                    <Route path="logout" element={<Logout />} />
                    <Route element={<PrivateRoute allowedRoles={"Student"} />}>
                        <Route path="/Student" element={<Student />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={"Admin"} />}>
                        <Route path="/Admin" element={<Admin />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={"Teacher"} />}>
                       <Route path="/Teacher" element={<Teacher />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </div >
    )
}

export default SetRoutes;