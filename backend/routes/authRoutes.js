const express = require('express');
const { body } = require('express-validator');
const passport = require('../config/passport');
const { register, login, googleCallback, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { updateProfile } = require('../services/userService');

const router = express.Router();

// POST /auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'hospital']).withMessage('Role must be student or hospital'),
  ],
  register
);

// POST /auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

// GET /auth/me
router.get('/me', authenticate, getMe);

// PATCH /auth/profile
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const updated = await updateProfile(req.user.id, req.body);
    res.json({ user: updated });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
