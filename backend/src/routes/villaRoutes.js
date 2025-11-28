import express from "express";
import {
    getAllVillas,
    getVillaById,
    bookVilla,
    addReview,
    replyToReview,
    createVilla, getUserReservations, getLastUserReservation
} from "../controllers/villaController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVillas);
router.get("/:id", getVillaById);
router.post("/:id/book", bookVilla);
router.post("/:id/reviews", addReview);
router.put("/:villaId/reviews/:reviewId/reply", replyToReview);
router.post("/", createVilla)
router.get('/reservations/last', protect, getLastUserReservation);
router.get('/reservations', protect, getUserReservations);

export default router;
