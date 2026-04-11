// backend/routes/authRoutes.js
import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { registerRules, loginRules } from '../validators/authValidators.js';
import User from '../models/user.js';

const router = express.Router();

// Custom middleware to allow public student/teacher registration
const allowRegistration = async (req, res, next) => {
  try {
    const userRole = req.body.role || 'student';

    // Check if any user exists and whether any admin exists
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });

    // If no users exist, allow first registration freely
    if (userCount === 0) {
      req.allowFirstUser = true;
      return next();
    }

    // If no admin exists yet, allow first admin registration freely
    if (userRole === 'admin' && adminCount === 0) {
      req.allowFirstAdmin = true;
      return next();
    }

    // Allow public student and teacher registration
    if (userRole === 'student' || userRole === 'teacher') {
      return next();
    }

    // For admin registration, require authentication
    // We need to call protect manually since we're in middleware
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to register non-student accounts' });
    }

    try {
      // Verify token and get user (simplified version of protect middleware)
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only admins can register administrators' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token invalid' });
    }
  } catch (err) {
    console.error('Registration middleware error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

router.get('/register-status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });

    const allowAnyRole = userCount === 0;
    const allowFirstAdmin = adminCount === 0;

    res.json({
      success: true,
      data: {
        userCount,
        adminCount,
        roles: {
          student: true,
          teacher: true,
          admin: allowAnyRole || allowFirstAdmin,
        },
      },
    });
  } catch (err) {
    console.error('Register status error:', err);
    res.status(500).json({ success: false, message: 'Server error while loading registration options' });
  }
});

// Public routes
router.post('/login', loginRules, login);
router.post('/register', registerRules, allowRegistration, register);
router.get('/me', protect, me);

export default router;
