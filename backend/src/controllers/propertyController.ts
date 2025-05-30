import Property from '../models/Property';
import { Request, Response } from 'express';

export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: (req as any).userId });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: 'Property creation failed' });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const properties = await Property.find(filters);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if ((property?.createdBy as any).toString() !== (req as any).userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if ((property?.createdBy as any).toString() !== (req as any).userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
};
