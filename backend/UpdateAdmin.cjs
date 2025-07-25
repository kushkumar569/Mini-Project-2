require("dotenv").config();
const express = require("express");
const { Router } = require("express");
const Update = Router();
const app = express();
app.use(express.json());
const { Location } = require("../DataBase/ClassDetail.cjs");
const { Teacher, Student } = require("../DataBase/Account.cjs");
const { subject } = require("../DataBase/subject.cjs");
const { schedule } = require("../DataBase/TImeTable.cjs");

Update.post("/UpdateStudent", async (req, res) => {
    try {
        const { prefix, from, to, department, semester, section } = req.body;
        if (!prefix || !from || !to || !department || !semester || !section) {
            return res.status(400).json({ error: "All fields are required" })
        }
        for (let i = from; i <= to; i++) {
            const paddedNumber = i.toString().padStart(3, '0');
            const entryNo = `${prefix}${paddedNumber}`;
            const updt = await Student.findOneAndUpdate(
                { entryNo },
                { $set: { department, semester, section } }
            );
            if (!updt) {
                // console.log(`Student ${entryNo} does not exists`);
                continue;
            }
        }
        return res.status(200).json({ message: "Student Update successfully" })
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

Update.put("/updateLocation", async (req, res) => {
    try {
        const { vanue,latitude,longitude } = req.body;
        if (!vanue || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const updt = await Location.findOneAndUpdate(
            { vanue },
            { $set: { latitude, longitude } }
        );
        if (!updt) {
            return res.status(404).json({ error: "Location not found" })
        }
        return res.status(200).json({ message: "Location Update successfully" })
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

Update.put("/updateTeacher",async (req, res) => {
    try {
        const { email,name,department } = req.body;
        if (!email || !name || !department) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const updt = await Teacher.findOneAndUpdate(
            { email },
            { $set: { name, department:department.toUpperCase() } }
        );
        if (!updt) {
            return res.status(404).json({ error: "Teacher not found" })
        }
        return res.status(200).json({ message: "Teacher Update successfully" })
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

Update.put("/updateSchedule",async (req, res) => {
    try {
        const { courseCode,section,day,time } = req.body;
        if (!courseCode || !section || !day || !time) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const updt = await schedule.findOneAndUpdate(
            { courseCode },
            { $set: { section, day,time } }
        );
        if (!updt) {
            return res.status(404).json({ error: "Schedule not found" })
        }
        return res.status(200).json({ message: "Schedule Update successfully" })
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

Update.put("/updateClass",async (req, res) => {
    try {
        const { courseCode,teacher,department,semester } = req.body;
        if (!courseCode || !teacher || !department || !semester) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const updt = await subject.findOneAndUpdate(
            { courseCode },
            { $set: { email:teacher,department:department.toUpperCase(),semester } }
        );
        if (!updt) {
            return res.status(404).json({ error: "Classes not found" })
        }
        return res.status(200).json({ message: "Classes Update successfully" })
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = {
    Update: Update
}