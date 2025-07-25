require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Teacher, Student, Admin } = require("../DataBase/Account.cjs");
const { detail, Attendence } = require("../DataBase/Attendence.cjs");
const { subject } = require("../DataBase/subject.cjs");
const { Info, course, schedule } = require("../DataBase/TImeTable.cjs");
const { ClassDetail,Live,Location } = require("../DataBase/ClassDetail.cjs")
const {Login} = require("./login.cjs");
const {Class} = require("./class.cjs")
const {SetData} = require("./set.cjs");
const {Get} = require("./getDetail.cjs")
const {Add} = require("./AddAdmin.cjs")
const {Delete} = require("./DeleteAdmin.cjs")
const {Update} = require("./UpdateAdmin.cjs")

require("dotenv").config();
const app = express();
app.use(express.json());

const corsOptions = {
    origin: [
      `${process.env.FRONTEND_URL}`,
      "https://geofencing-attendance-manager.vercel.app"
    ],
    credentials: true
  };
  
app.use(cors(corsOptions));

app.use("/",Login);
app.use("/class",Class);
app.use("/setData",SetData);
app.use("/get",Get)
app.use("/Add",Add)
app.use("/Delete",Delete)
app.use("/Update",Update)

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
