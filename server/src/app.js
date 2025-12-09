const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv/config");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = ['http://localhost:5173']

app.use(cors({
  origin: (origin, callback) => callback(null, origin), // allow all origins
  credentials: true
}));

app.use(express.json());
app.use(cors({origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

//API Endpoints
app.get("/", (req, res) => { res.send("Welcome to the Auth System API"); });

//all signup, login and logout routes will be handled here
app.use("/api/auth", authRouter);

//profile related routes will be handled here
app.use("/api/user", userRouter);

connectDB()
    .then(() => {
        console.log("Database connected successfully!!");
        app.listen(port, () => {
            console.log(`Server is running on port no: ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed: " + err.message)
    });
