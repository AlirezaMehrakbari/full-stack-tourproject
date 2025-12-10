import express from "express";
import {
    getAllVillas,
    getVillaById,
    bookVilla,
    addReview,
    replyToReview,
    createVilla,
    getUserReservations,
    getLastUserReservation,
    toggleFavorite,
    getFavorites,
    getMyVillas,
    updateVilla,
    deleteVilla
} from "../controllers/villaController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get('/reservations/last', protect, getLastUserReservation);
router.get('/reservations', protect, getUserReservations);

router.get('/favorites', protect, getFavorites);
router.post('/:id/favorite', protect, toggleFavorite);

router.post('/', protect, authorize('owner'), createVilla);
router.get('/owner/my-villas', protect, authorize('owner'), getMyVillas);
router.put('/:id', protect, authorize('owner'), updateVilla);
router.delete('/:id', protect, authorize('owner'), deleteVilla);



router.get('/', getAllVillas);
router.get('/:id', getVillaById);

router.post('/:id/book', protect, bookVilla);
router.post('/:id/reviews', protect, addReview);
router.put('/:villaId/reviews/:reviewId/reply', protect, authorize('owner'), replyToReview);

export default router;
