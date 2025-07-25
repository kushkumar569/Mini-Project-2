import { useState } from "react";
import Header from "../Header";
import AddStudent from "./AddStudent";
import AddLocation from "./AddLocation";
import AddTeacher from "./AddTeacher";
import SetSchedule from "./SetSchedule";
import AddClasses from "./AddClasses";
import DeleteStudent from "./DeleteStudent";
import DeleteLocation from "./DeleteLocation";
import DeleteTeacher from "./DeleteTeacher";
import DeleteSchedule from "./DeleteSchedule";
import DeleteClasses from "./DeleteClasses";
import UpdateStudent from "./UpdateStudent";
import UpdateLocation from "./UpdateLocation";
import UpdateTeacher from "./UpdateTeacher";
import UpdateSchedule from "./UpdateSchedule";
import UpdateClasses from "./UpdateClasses";
import Logout from "../Login/Logout";

const options = {
    Student: ["Add", "Delete", "Update"],
    Location: ["Add", "Delete", "Update"],
    Teacher: ["Add", "Delete", "Update"],
    Schedule: ["Set", "Delete", "Update"],
    Classes: ["Add", "Delete", "Update"]
};

export default function Admin() {
    const [selectedCategory, setSelectedCategory] = useState("Student");
    const [selectedAction, setSelectedAction] = useState("Add");

    const renderComponent = () => {
        switch (selectedCategory + "_" + selectedAction) {
            case "Student_Add":
                return <AddStudent />;
            case "Student_Delete":
                return <DeleteStudent />;
            case "Student_Update":
                return <UpdateStudent />;
            case "Location_Add":
                return <AddLocation />;
            case "Location_Delete":
                return <DeleteLocation />;
            case "Location_Update":
                return <UpdateLocation />;
            case "Teacher_Add":
                return <AddTeacher />;
            case "Teacher_Delete":
                return <DeleteTeacher />;
            case "Teacher_Update":
                return <UpdateTeacher />;
            case "Schedule_Set":
                return <SetSchedule />;
            case "Schedule_Delete":
                return <DeleteSchedule />;
            case "Schedule_Update":
                return <UpdateSchedule />;
            case "Classes_Add":
                return <AddClasses />;
            case "Classes_Delete":
                return <DeleteClasses />;
            case "Classes_Update":
                return <UpdateClasses />;
            default:
                return <div>Select an action</div>;
        }
    };

    return (
        <>
            <Header />
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 px-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setSelectedAction(options[e.target.value][0]); // Reset to first option
                        }}
                        className="border px-4 py-2 rounded-md"
                    >
                        {Object.keys(options).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Action</label>
                    <select
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        className="border px-4 py-2 rounded-md"
                    >
                        {options[selectedCategory].map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-4">{renderComponent()}</div>
        </>
    );
}
