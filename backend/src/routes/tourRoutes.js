import express from "express";
import {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    bookTour,
    addReview
} from "../controllers/tourController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTours);
router.post("/", protect, createTour);

router.post("/:id/book", protect, bookTour);
router.post("/:id/review", protect, addReview);

router.get("/:id", getTourById);
router.put("/:id", protect, updateTour);
router.delete("/:id", protect, deleteTour);

export default router;
