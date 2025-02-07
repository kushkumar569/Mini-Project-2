require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Configure session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Secret key for session encryption
        resave: false, // Prevents resaving unchanged sessions
        saveUninitialized: true, // Saves uninitialized sessions
    })
);

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Enable session support for Passport

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth Client ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth Client Secret
            callbackURL: "http://localhost:3000/auth/google/callback", // OAuth callback URL
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile); // Pass user profile to the next middleware
        }
    )
);

// Serialize user into session
passport.serializeUser((user, done) => done(null, user));
// Deserialize user from session
passport.deserializeUser((user, done) => done(null, user));

// Home route with login link
app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
});

// Google authentication route
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }) // Request Google profile and email
);

// Google OAuth callback route
app.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/" }),
(req, res) => {
        res.redirect("/profile"); // Redirect to profile on success
    }
);

// Profile route to display user information
app.get("/profile", function (req, res){
    console.log(req.user.emails);
    console.log(req.user.displayName);
    console.log(req.user.photos);
    res.send(`Welcome ${req.user.displayName}`); // Display logged-in user’s name
});

// Logout route
app.get("/logout", (req, res) => {
    res.redirect("/"); // Redirect to home after logout
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log(`Server is running at port 3000`);
});
