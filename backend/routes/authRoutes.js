import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateReferralCode = async () => {
  let code = '';
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    code = `VEYORA-${randomStr}`;
    const existing = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  return code;
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const referralCode = await generateReferralCode();

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone ? String(phone).trim() : null,
        role: 'user', // Enforce default role to avoid unauthorized privilege escalation
        loyaltyPoints: 0,
        referralCode
      }
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is missing from server configuration.' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      jwtSecret,
      { expiresIn }
    );

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      loyaltyPoints: newUser.loyaltyPoints,
      referralCode: newUser.referralCode,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    return res.status(201).json({
      success: true,
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'An unexpected server error occurred during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is missing from server configuration.' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'An unexpected server error occurred during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
