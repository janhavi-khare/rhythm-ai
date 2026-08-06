const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const dashboardRoutes = require("./routes/dashboard");
const checkInRoutes = require("./routes/checkin");
const workoutRoutes = require("./routes/workout");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/dashboard", dashboardRoutes);
app.use("/checkin", checkInRoutes);
app.use("/workout", workoutRoutes);

require("dotenv").config();

mongoose.connect(
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/rhythm"
);

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

const { normalizeGoals } = require("./constants/goals");

app.post("/onboarding", async (req, res) => {
    try {
        const updateData = {};
        if (req.body.height !== undefined) updateData.height = req.body.height;
        if (req.body.weight !== undefined) updateData.weight = req.body.weight;
        if (req.body.cycleLength !== undefined) updateData.cycleLength = req.body.cycleLength;
        if (req.body.periodLength !== undefined) updateData.periodLength = req.body.periodLength;
        if (req.body.lastPeriodDate !== undefined) updateData.lastPeriodDate = req.body.lastPeriodDate;
        if (req.body.activityLevel !== undefined) updateData.activityLevel = req.body.activityLevel;
        if (req.body.goals !== undefined) updateData.goals = normalizeGoals(req.body.goals);

        const result = await UserModel.findOneAndUpdate(
            { email: req.body.email },
            updateData,
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


