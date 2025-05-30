import express, { RequestHandler } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController';

const router = express.Router();

router.post('/:propertyId', authMiddleware, addFavorite as any);
router.delete('/:propertyId', authMiddleware, removeFavorite as any);
router.get('/', authMiddleware, getFavorites as any);

export default router;