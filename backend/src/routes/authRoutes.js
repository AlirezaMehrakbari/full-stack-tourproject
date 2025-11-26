import express from "express";
import {
    enterPhoneNumber,
    phoneNumberVerification,
    login,
    register, getMe
} from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/me", protect, getMe);
router.post("/enter-phoneNumber", enterPhoneNumber);
router.post("/phoneNumber-verification", phoneNumberVerification);
router.post("/login", login);
router.post("/register", register);

export default router;
