require("dotenv").config();
const express = require("express");
const { Router } = require("express");
const Delete = Router();
const app = express();
app.use(express.json());
const { Location } = require("../DataBase/ClassDetail.cjs");
const { Teacher, Student } = require("../DataBase/Account.cjs");
const { subject } = require("../DataBase/subject.cjs");
const { schedule, course, Info } = require("../DataBase/TImeTable.cjs");
const {detail,Attendence} = require("../DataBase/Attendence.cjs")

Delete.delete("/DeleteLocation", async (req, res) => {
    try {
        const { vanue } = req.body;
        console.log(vanue);
        if (!vanue) {
            return res.status(400).json({ error: "Venue is required" });
        }
        const location = await Location.findOneAndDelete({ vanue });
        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }
        return res.status(200).json({ message: "Location deleted successfully" })
    } catch (error) {
        console.error("Database error:", error);
    }
})

Delete.delete("/DeleteTeacher", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const teacher = await Teacher.findOneAndDelete({ email });
        console.log(teacher);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        return res.status(200).json({ message: "Teacher's Account deleted successfully" })
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

Delete.delete("/DeleteClass", async (req, res) => {
    try {
        const { courseCode } = req.body;
        if (!courseCode) {
            return res.status(400).json({ error: "Course code is required" });
        }
        const classes = await subject.findOneAndDelete({ courseCode });
        const detaildelete = await detail.findOneAndDelete({ courseCode });
        // console.log(detaildelete);
        if(detaildelete){
            const ids = detaildelete._id
            // console.log(ids);            
            const attdelete = await Attendence.deleteMany({ ids });
        }
        console.log(classes);
        if (!classes) {
            console.log("class not found");
            
            return res.status(404).json({ error: "Class not found" });
        }
        console.log("class deleted");
        return res.status(200).json({ message: "Class deleted successfully" })
    }
    catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "database error" })
    }
})

Delete.delete("/DeleteTeacherClass", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const classes = await subject.find({ email }); // Get the classes first
        await subject.deleteMany({ email });           // Then delete them

        if (!classes || classes.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Extract courseCodes
        const courseCodes = classes.map(cls => cls.courseCode);

        return res.status(200).json({ courseCodes });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


Delete.delete("/DeleteSchedule", async (req, res) => {
    try {
        const { scheduleId } = req.body;
        if (!scheduleId) {
            return res.status(400).json({ error: "ScheduleId is required" });
        }
        const schedules = await schedule.findOneAndDelete({ _id: scheduleId });
        console.log(schedules);
        if (!schedules) {
            return res.status(404).json({ error: "schedule not found" });
        }
        return res.status(200).json({ message: "schedule deleted successfully" })
    }
    catch (error) {
        console.error("Database error:", error);
    }
})

Delete.delete("/DeleteRelationalSchedule", async (req, res) => {
    try {
        const { courseCode } = req.body;
        console.log(courseCode);

        if (!Array.isArray(courseCode) || courseCode.length === 0) {
            return res.status(400).json({ error: "courseCode must be a non-empty array" });
        }

        await Promise.all(courseCode.map(async (code) => {
            console.log("Processing:", code);

            const schedules = await schedule.deleteMany({ courseCode: code });
            const deletedCourse = await course.findOneAndDelete({ courseCode: code });

            if (deletedCourse) {
                const id = deletedCourse.ids; // assuming "ids" field exists
                const existingInfo = await course.findOne({ ids: id });

                if (!existingInfo) {
                    const infoDeleted = await Info.findOneAndDelete({ _id: id });
                    console.log("Info deleted:", infoDeleted);
                }
            } else {
                console.warn(`Course with courseCode ${code} not found.`);
            }
        }));

        return res.status(200).json({ message: "All provided schedules and courses processed successfully" });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

})

Delete.delete("/DeleteStudent", async (req, res) => {
    try {
        const { prefix, from, to } = req.body;
        if (!prefix || !from || !to) {
            return res.status(400).json({ error: "Prefix is required" });
        }
        for (let i = from; i <= to; i++) {
            const paddedNumber = i.toString().padStart(3, '0');
            const entryNo = `${prefix}${paddedNumber}`;

            const existingStudent = await Student.findOneAndDelete({ entryNo });
            if (!existingStudent) {
                // console.log(`Student ${entryNo} does not exists`);
                continue;
            }
        }
        return res.status(200).json({ message: "Student deleted successfully" })
    } catch (error) {
        console.error("Database error:", error);
    }
})



module.exports = {
    Delete: Delete
};