require("dotenv").config();
const express = require("express");
const {Router} = require("express");
const Login = Router();
const mongoose = require("mongoose");
const { Teacher, Student, Admin } = require("../DataBase/Account.cjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser()); // Required for reading cookies

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const PORT = process.env.PORT || 3000;

// **🔹 Login Route**
Login.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // **1️⃣ Check User in Different Models**
    const models = { Teacher, Student, Admin };
    let userType = null;
    let user = null;

    for (const [role, Model] of Object.entries(models)) {
        user = await Model.findOne({ email });
        if (user) {
            userType = role;
            break; // Stop if found
        }
    }

    // console.log(user);
    
    // **2️⃣ If User Not Found**
    if (!user) {
        return res.status(401).json({ message: "Wrong email or password" });
    }

    // **3️⃣ Validate Password (Using bcrypt)**
    const isPasswordValid = (password ===user.password) ? true : false;
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong email or password...." });
    }

    // **4️⃣ Generate JWT Token**
    const token = jwt.sign({ email, role: userType }, JWT_SECRET, { expiresIn: "7d" });

    console.log(token);
    
    // **5️⃣ Store Token in HTTP-only Cookie**
    return res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    }).json({ success: true, role: userType });
});


// **🔹 Persistent Login (Auto-Login)**
const authenticateUser = (req, res, next) => {
    console.log("Raw Cookies:", req.headers.cookie); // ✅ Log raw cookies for debugging

    // ✅ Manually extract token from raw cookie string
    const rawCookies = req.headers.cookie;
    const token = rawCookies?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, please login" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token!" });
        }

        req.user = decoded; // Attach user details to request
        next();
    });
};

// **🔹 Auto-Login Route**
Login.get("/me", authenticateUser, (req, res) => {
    console.log("hyyyyy");
    
    res.json({
        message: `Welcome back, ${req.user.role}!`,
        user: req.user,
    });
});

// **🔹 Logout Route**
Login.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully!" });
});

module.exports = {
    Login: Login
}
