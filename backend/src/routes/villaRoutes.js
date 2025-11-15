import express from "express";
import {
    getAllVillas,
    getVillaById,
    bookVilla,
    addReview,
    replyToReview,
    createVilla
} from "../controllers/villaController.js";

const router = express.Router();

router.get("/", getAllVillas);
router.get("/:id", getVillaById);
router.post("/:id/book", bookVilla);
router.post("/:id/reviews", addReview);
router.put("/:villaId/reviews/:reviewId/reply", replyToReview);
router.post("/", createVilla);

export default router;
