require("dotenv").config();
const express = require("express");
const { Router } = require("express");
const Class = Router();
const mongoose = require("mongoose");
const { Teacher, Student, Admin } = require("../DataBase/Account.cjs");

const { subject } = require("../DataBase/subject.cjs");
const { course, schedule } = require("../DataBase/TImeTable.cjs");

const app = express();
app.use(express.json());

Class.post("/data", async (req, res) => {
    function getCurrentDateTime() {
        const now = new Date();

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const day = days[now.getDay()]; // Current day (Sunday, Monday, etc.)

        // Time in 24-hour format (HH:MM:SS)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;

        const date = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = now.getFullYear();
        const formattedDate = `${date}/${month}/${year}`;

        return { day, time, date };
    }

    console.log("class");

    const { day, time, date } = getCurrentDateTime(); // ✅ Fixed variable names
    const { email } = req.body;

    try {
        const users = await subject.find({ email }); // Fetch all subjects of the user

        let matchedClasses = [];

        console.log(users);

        for (const user of users) {
            const matchedSchedule = await schedule.findOne({
                courseCode: user.courseCode,
                day: day, // ✅ Fixed variable name
                time: { $elemMatch: { $regex: `^${time.substring(0, 2)}` } } // Match first 2 characters (HH)
            });

            if (matchedSchedule) {
                matchedClasses.push({
                    ...user.toObject(),
                    section: matchedSchedule.section,
                    day,
                    date,
                    time
                });

            }
        }
        console.log(matchedClasses);

        res.status(200).json({ matchedClasses: matchedClasses });
    } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = {
    Class: Class
};
