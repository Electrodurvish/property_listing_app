import User from '../models/User';
import Property from '../models/Property';
import { Request, Response } from 'express';

export const recommendProperty = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
    const propertyObjectId = new (require('mongoose').Types.ObjectId)(req.params.propertyId);
    if (!recipient.recommendations.includes(propertyObjectId)) {
      recipient.recommendations.push(propertyObjectId);
      await recipient.save();
    }
    res.json({ message: 'Property recommended successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Recommendation failed' });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId).populate('recommendations');
    res.json(user?.recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
