import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { getJwtSecret } from '../middleware/authMiddleware';

const router = Router();

router.post('/auth/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password must be strings' });
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || password.trim() === '') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: trimmedEmail,
      password: hashedPassword,
      role: 'user',
    },
  });

  return res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password must be strings' });
  }

  const trimmedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    token,
    role: user.role,
  });
});

export default router;
