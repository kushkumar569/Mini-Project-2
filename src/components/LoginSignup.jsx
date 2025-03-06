import React, { useState } from "react";
import "./LoginSignup.css";

import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

export const LoginSignup = () => {
  const [action, setAction] = useState("Student Login");

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {/* Show department input only for Teacher and Admin login */}
        {action !== "Student Login" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Department" />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="E-mail ID" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" />
        </div>
      </div>

      <div className="submit-container">
        <div
          className={`submit ${action === "Teacher Login" ? "gray" : ""}`}
          onClick={() => setAction("Teacher Login")}
        >
          Teacher Login
        </div>
        <div
          className={`submit ${action === "Student Login" ? "gray" : ""}`}
          onClick={() => setAction("Student Login")}
        >
          Student Login
        </div>
        <div
          className={`submit ${action === "Admin Login" ? "gray" : ""}`}
          onClick={() => setAction("Admin Login")}
        >
          Admin Login
        </div>
      </div>
    </div>
  );
};





