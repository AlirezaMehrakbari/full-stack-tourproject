import express from 'express';
import {
    getMyProfile,
    updateMyProfile,
    deleteProfileImage
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.delete('/profile/image', deleteProfileImage);

export default router;
