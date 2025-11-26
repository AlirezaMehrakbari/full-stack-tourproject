import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const enterPhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const code = Math.floor(1000 + Math.random() * 9000);

        let user = await User.findOne({ phoneNumber });

        if (user) {
            user.verificationCode = code;
            user.verificationCodeExpires = Date.now() + 2 * 60 * 1000;
            await user.save({ validateBeforeSave: false });
        } else {
            user = new User({
                phoneNumber,
                verificationCode: code,
                verificationCodeExpires: Date.now() + 2 * 60 * 1000,
            });
            await user.save({ validateBeforeSave: false });
        }

        return res.status(200).json({
            message: "Verification code generated",
            code,
            userExists: Boolean(user.firstName),
        });

    } catch (error) {
        console.log("ENTER PHONE ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const phoneNumberVerification = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        const user = await User.findOne({ phoneNumber });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.verificationCode !== code)
            return res.status(400).json({ message: "Invalid verification code" });

        if (Date.now() > user.verificationCodeExpires)
            return res.status(400).json({ message: "Verification code expired" });

        return res.json({
            message: "Verified",
            verified: true,
            userExists: Boolean(user.firstName),
        });

    } catch (error) {
        console.log("VERIFICATION ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};



export const login = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const user = await User.findOne({ phoneNumber });

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Logged in successfully",
            token,
            user,
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const register = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, role } = req.body;

        let user = await User.findOne({ phoneNumber });


        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.role = role || "user";
            await user.save();
        } else {
            user = await User.create({
                firstName,
                lastName,
                phoneNumber,
                role: role || "user",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "User created",
            user,
            token
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-__v -updatedAt -createdAt");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

