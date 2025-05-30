import express, { RequestHandler } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { recommendProperty, getRecommendations, searchUsers } from '../controllers/recommendationController';

const router = express.Router();

router.post('/:propertyId', authMiddleware, recommendProperty as any);
router.get('/', authMiddleware, getRecommendations as any);
router.get('/search-users', authMiddleware, searchUsers as any);

export default router;
