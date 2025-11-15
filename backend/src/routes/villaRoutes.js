// src/routes/villaRoutes.js

import express from "express";
import {
    getAllVillas,
    getVillaById,
    bookVilla,
    addReview,
    replyToReview
} from "../controllers/villaController.js";

const router = express.Router();

// لیست ویلاها با فیلتر
router.get("/", getAllVillas);

// جزئیات یک ویلا
router.get("/:id", getVillaById);

// رزرو ویلا
router.post("/:id/book", bookVilla);

// ثبت دیدگاه
router.post("/:id/reviews", addReview);

// پاسخ به دیدگاه
router.put("/:villaId/reviews/:reviewId/reply", replyToReview);

export default router;
