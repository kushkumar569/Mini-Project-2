require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Teacher, Student, Admin } = require("../DataBase/Account.cjs");
const { detail, Attendence } = require("../DataBase/Attendence.cjs");
const { subject } = require("../DataBase/subject.cjs");
const { Info, course, schedule } = require("../DataBase/TImeTable.cjs");
const {Login} = require("../src/components/Login/index.cjs");
const {Class} = require("./class.cjs")

const app = express();
app.use(express.json());

// Enable CORS with specific origin
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend to access backend
    credentials: true // Allow cookies to be sent
}));


app.use("/",Login);
app.use("/class",Class);

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process on failure
    }
}


main();
