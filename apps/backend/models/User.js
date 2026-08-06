const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    password:{
    type:String,
    required:true
},

    height: Number,
    weight: Number,
    
    cycleLength: Number,
    periodLength: Number,
    lastPeriodDate: Date,
    goals: [String],
    activityLevel: String
})

const UserModel = mongoose.models.User || mongoose.model("User", userSchema, "users");
module.exports = UserModel;