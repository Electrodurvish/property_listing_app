import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { recommendProperty, getRecommendations } from '../controllers/recommendationController';
const router = express.Router();

router.post('/:propertyId', authMiddleware, recommendProperty);
router.get('/', authMiddleware, getRecommendations);

export default router;
