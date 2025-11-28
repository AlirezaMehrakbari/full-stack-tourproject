import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid authorization format" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id };

        next();
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Authentication failed" });
    }
};
