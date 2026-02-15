const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String },

    email: { 
        type: String, 
        required: true,
        unique: true 
    },

    password: { 
        type: String, 
        required: true 
    },

    // 🔹 ADD THESE TWO FIELDS HERE
    resetToken: { type: String },
    resetTokenExpire: { type: Date },

    createdOn: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model("User", userSchema);
