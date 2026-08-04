const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const dashboardRoutes = require("./routes/dashboard");
const checkInRoutes = require("./routes/checkin");
const morningCheckinRoutes = require("./routes/morningCheckin");
const workoutRoutes = require("./routes/workout");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/dashboard", dashboardRoutes);
app.use("/checkin", checkInRoutes);
app.use(
  "/checkin/morning",
  morningCheckinRoutes
);
app.use("/workout", workoutRoutes);

mongoose.connect("mongodb://localhost:27017/rhythm")

require("dotenv").config();

app.post("/signup", (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            if (user.password !== password) {
                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }
            res.json({
                message: "Login successful",
                userId: user._id,
                user: {
                    name: user.name,
                    email: user.email
                }
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

app.post("/onboarding", async (req, res) => {
    try {

        const result = await UserModel.findOneAndUpdate(
            { email: req.body.email },
            {
                height: req.body.height,
                weight: req.body.weight,

                cycleLength: req.body.cycleLength,
                periodLength: req.body.periodLength,
                lastPeriodDate: req.body.lastPeriodDate,

                goals: req.body.goals,
                activityLevel: req.body.activityLevel
            },
            { new: true }
        );

        res.json(result);

    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})


