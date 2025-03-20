require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const { Teacher,Student,Admin } = require("../DataBase/Account");
const { detail,Attendence } = require("../DataBase/Attendence");
const { subject } = require("../DataBase/subject");
const { Info,course,schedule } = require("../DataBase/TImeTable");
const app = express();
app.use(express.json());

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
