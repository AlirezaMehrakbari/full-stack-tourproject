import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ورود شماره تلفن و ارسال کد
export const enterPhoneNumber = async (req, res) => {
    try {
        const {phoneNumber} = req.body;

        const code = Math.floor(1000 + Math.random() * 9000);

        let user = await User.findOne({phoneNumber});

        if (user) {
            user.verificationCode = code;
            user.verificationCodeExpires = Date.now() + 2 * 60 * 1000;
            await user.save({validateBeforeSave: false});
        } else {
            user = new User({
                phoneNumber,
                verificationCode: code,
                verificationCodeExpires: Date.now() + 2 * 60 * 1000,
            });
            await user.save({validateBeforeSave: false});
        }

        return res.status(200).json({
            success: true,
            message: "کد تایید ارسال شد",
            code, // در production حذف شود
            userExists: Boolean(user.firstName),
        });

    } catch (error) {
        console.log("ENTER PHONE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "خطای سرور"
        });
    }
};

// تایید کد ارسالی
export const phoneNumberVerification = async (req, res) => {
    try {
        const {phoneNumber, code} = req.body;

        const user = await User.findOne({phoneNumber});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربر یافت نشد"
            });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: "کد تایید نامعتبر است"
            });
        }

        if (Date.now() > user.verificationCodeExpires) {
            return res.status(400).json({
                success: false,
                message: "کد تایید منقضی شده است"
            });
        }

        // علامت‌گذاری کاربر به عنوان تایید شده
        user.isVerified = true;
        await user.save();

        return res.json({
            success: true,
            message: "شماره تلفن تایید شد",
            verified: true,
            userExists: Boolean(user.firstName),
        });

    } catch (error) {
        console.log("VERIFICATION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "خطای سرور"
        });
    }
};

// ورود کاربر (برای کاربران موجود)
export const login = async (req, res) => {
    try {
        const {phoneNumber} = req.body;

        const user = await User.findOne({phoneNumber});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربر یافت نشد"
            });
        }

        if (!user.firstName) {
            return res.status(400).json({
                success: false,
                message: "لطفاً ابتدا ثبت‌نام کنید"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        // حذف فیلدهای حساس
        const userResponse = user.toObject();
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeExpires;

        return res.json({
            success: true,
            message: "ورود موفقیت‌آمیز",
            token,
            user: userResponse,
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "خطای سرور"
        });
    }
};

// ثبت‌نام کاربر جدید
export const register = async (req, res) => {
    try {
        const {firstName, lastName, phoneNumber, role} = req.body;

        // اعتبارسنجی ورودی‌ها
        if (!firstName || !lastName || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "لطفاً تمام فیلدهای الزامی را پر کنید"
            });
        }

        let user = await User.findOne({phoneNumber});

        if (user) {
            // به‌روزرسانی کاربر موجود
            user.firstName = firstName;
            user.lastName = lastName;
            user.role = role || "user";
            user.isVerified = true;
            await user.save();
        } else {
            // ایجاد کاربر جدید
            user = await User.create({
                firstName,
                lastName,
                phoneNumber,
                role: role || "user",
                isVerified: true
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        // حذف فیلدهای حساس
        const userResponse = user.toObject();
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeExpires;

        return res.status(201).json({
            success: true,
            message: "ثبت‌نام موفقیت‌آمیز",
            user: userResponse,
            token
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "خطای سرور",
            error: error.message
        });
    }
};

// دریافت اطلاعات کاربر جاری
export const getMe = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "احراز هویت نشده"
            });
        }

        const user = await User.findById(req.user.id).select('-verificationCode -verificationCodeExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربر یافت نشد"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "خطای سرور",
            error: error.message
        });
    }
};
