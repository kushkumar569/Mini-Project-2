require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { Teacher, Student, Admin } = require("../../../DataBase/Account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser()); // Required for reading cookies

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const PORT = process.env.PORT || 3000;

// **🔹 Login Route**
app.post("/login", async (req, res) => {
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

    // **2️⃣ If User Not Found**
    if (!user) {
        return res.status(401).json({ message: "Wrong email or password" });
    }

    // **3️⃣ Validate Password (Using bcrypt)**
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong email or password" });
    }

    // **4️⃣ Generate JWT Token**
    const token = jwt.sign({ email, role: userType }, JWT_SECRET, { expiresIn: "7d" });

    // **5️⃣ Store Token in HTTP-only Cookie**
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    // **6️⃣ Send Response with User Type**
    res.json({ success: true, role: userType });
});

// **🔹 Persistent Login (Auto-Login)**
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

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
app.get("/me", authenticateUser, (req, res) => {
    res.json({
        message: `Welcome back, ${req.user.role}!`,
        user: req.user,
    });
});

// **🔹 Logout Route**
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully!" });
});

// **🔹 Start Server**
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
