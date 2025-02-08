import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import jwt from "jsonwebtoken";
import path from "path";  // Import path module
import { fileURLToPath } from "url";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


// Convert __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = "KushKushwaha";

const users = [];
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "your_secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

//  Serve static files from the public directory
app.use(express.static(path.join(__dirname)));  

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//  Serve home.html properly
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const username = req.user.emails[0].value;
        const token = jwt.sign({ username }, JWT_SECRET);

        //  Redirect frontend with token
        res.redirect(`http://localhost:3000/home.html?token=${token}`);
    }
);

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    users.push({ username, password });

    res.json({ message: "You are signed up" });
});

app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    let foundUser = users.find(user => user.username === username && user.password === password);

    if (!foundUser) {
        return res.status(401).json({ message: "Credentials incorrect" });
    }

    const token = jwt.sign({ username }, JWT_SECRET);

    res.json({ token });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
