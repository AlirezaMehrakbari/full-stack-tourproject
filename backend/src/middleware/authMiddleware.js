import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "دسترسی غیرمجاز - توکن یافت نشد"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id)
            .select('-verificationCode -verificationCodeExpires');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "کاربر یافت نشد"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            success: false,
            message: "دسترسی غیرمجاز - توکن نامعتبر"
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `نقش ${req.user.role} دسترسی به این منبع را ندارد`
            });
        }
        next();
    };
};
