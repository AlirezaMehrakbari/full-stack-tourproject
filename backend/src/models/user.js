import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    role: {
        type: String,
        default: "user"
    },

    verificationCode: String,
    verificationCodeExpires: Date,

    favorites: {
        type: [Number],
        default: []
    }
});

export default mongoose.model("User", userSchema);
