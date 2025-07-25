require("dotenv").config();
const express = require("express");
const { Router } = require("express");
const Add = Router();
const { Teacher, Student, Admin } = require("../DataBase/Account.cjs")
const { Location } = require("../DataBase/ClassDetail.cjs")
const { subject } = require("../DataBase/subject.cjs")
const { schedule, Info, course } = require("../DataBase/TImeTable.cjs")

// const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

Add.post("/AddTeacher", async (req, res) => {
    try {
        const { email, password, name, department } = req.body;

        if (!email || !password || !name || !department) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(409).json({ error: "Teacher account already exists" }); // 409 Conflict
        }

        // Create new teacher
        const newTeacher = await Teacher.create({
            email,
            password,
            name,
            department: department.toUpperCase(),
        });

        return res.status(201).json(newTeacher); // 201 Created
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

Add.post("/AddLocation", async (req, res) => {
    try {
        const { vanue, latitude, longitude } = req.body;
        console.log(vanue, latitude, longitude);
        if (!vanue || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingLocation = await Location.findOne({ vanue });
        if (existingLocation) {
            return res.status(409).json({ error: "Location already exists" });
        }
        const newLocation = await Location.create({
            vanue,
            latitude,
            longitude
        });
        return res.status(201).json(newLocation);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

})

Add.post("/AddStudent", async (req, res) => {
    try {
        const { prefix, from, to, department, semester, section, password } = req.body;
        console.log(prefix, from, to, department, semester, section, password);

        if (!prefix || !from || !to || !department || !semester || !section || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newStudents = [];

        for (let i = from; i <= to; i++) {
            const paddedNumber = i.toString().padStart(3, '0'); // Ensures 3-digit number with leading zeros
            const entryNo = `${prefix}${paddedNumber}`;
            const email = `${entryNo}@smvdu.ac.in`;

            const existingStudent = await Student.findOne({ entryNo, email });
            if (existingStudent) {
                console.log(`Student ${entryNo} already exists`);
                continue; // Skip and move to next student
            }

            const student = await Student.create({
                entryNo,
                email,
                name: "Student Name",
                password,
                department,
                semester,
                section
            });

            newStudents.push(student);
        }

        if (newStudents.length === 0) {
            return res.status(409).json({ error: "No new students added. All already exist." });
        }

        console.log(newStudents);
        return res.status(201).json(newStudents);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

Add.post("/AddClass", async (req, res) => {
    try {
        const { teacher, courseCode, department, semester, courseName } = req.body;
        console.log(teacher, courseCode, department, semester, courseName);
        if (!teacher || !courseCode || !department || !semester || !courseName) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingClass = await subject.findOne({ courseCode });
        if (existingClass) {
            return res.status(409).json({ error: "Class already exists" });
        }
        const newClass = await subject.create({
            email: teacher,
            courseCode: courseCode.toUpperCase(),
            courseName,
            department: department.toUpperCase(),
            semester,
        })
        console.log(newClass);
        
        return res.status(201).json(newClass);
    } catch (error) {
        console.error("Database error:", error);
    }
})

Add.post("/AddSchedule", async (req, res) => {
    try {
        const { courseCode, courseName, department, semester, section, day, time } = req.body;
        if (!courseCode || !section || !day || !time || !department || !semester || !courseName) {
            console.log(courseCode, courseName, department, semester, section, day, time);
            return res.status(400).json({ error: "All fields are required" });
        }
        // Ensure Info exists or create it
        let infoDoc = await Info.findOne({ department, semester });
        if (!infoDoc) {
            infoDoc = await Info.create({
                department: department.toUpperCase(),
                semester
            });
        }

        // Ensure Course exists or create it
        let courseDoc = await course.findOne({ courseCode: courseCode.toUpperCase() });

        if (!courseDoc) {
            courseDoc = await course.create({
                ids: infoDoc._id,
                courseCode: courseCode.toUpperCase(),
                courseName
            });
        }

        // Check if Schedule already exists
        const existingSchedule = await schedule.findOne({ courseCode: courseCode.toUpperCase(), section });
        if (existingSchedule) {
            return res.status(409).json({ error: "Schedule already exists for this course and section" });
        }

        // Create new schedule
        const newSchedule = await schedule.create({
            courseCode: courseCode.toUpperCase(),
            section,
            day,
            time
        });

        return res.status(201).json({ message: "Schedule added successfully", data: newSchedule });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

Add.delete("/DeleteLocation", async (req, res) => {
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

module.exports = { Add };