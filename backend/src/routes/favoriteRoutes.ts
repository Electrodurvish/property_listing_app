import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController';
const router = express.Router();

router.post('/:propertyId', authMiddleware, addFavorite);
router.delete('/:propertyId', authMiddleware, removeFavorite);
router.get('/', authMiddleware, getFavorites);

export default router;