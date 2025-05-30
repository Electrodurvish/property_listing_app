import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'User registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};