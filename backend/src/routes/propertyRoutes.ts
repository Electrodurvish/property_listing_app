import express, { RequestHandler } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } from '../controllers/propertyController';
const router = express.Router();

router.post('/', authMiddleware, createProperty as any);
router.get('/', getProperties as any);
router.get('/:id', getPropertyById as any);
router.put('/:id', authMiddleware, updateProperty as any);
router.delete('/:id', authMiddleware, deleteProperty as any);

export default router;
