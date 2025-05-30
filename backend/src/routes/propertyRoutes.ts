import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createProperty, getProperties, updateProperty, deleteProperty } from '../controllers/propertyController';
const router = express.Router();

router.post('/', authMiddleware, createProperty);
router.get('/', getProperties);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

export default router;
