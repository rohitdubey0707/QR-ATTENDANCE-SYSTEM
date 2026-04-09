// backend/routes/authRoutes.js
import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { registerRules, loginRules } from '../validators/authValidators.js';
import User from '../models/user.js';

const router = express.Router();

// Custom middleware to allow first user or student registration without auth
const allowRegistration = async (req, res, next) => {
  try {
    // Check if any user exists
    const userCount = await User.countDocuments();
    
    // If no users exist, allow registration without restrictions
    if (userCount === 0) {
      return next();
    }
    
    // If users exist, check if trying to register as student
    if (req.body.role === 'student') {
      return next(); // Always allow student registration
    }
    
    // For teacher/admin registration, require authentication
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
        return res.status(403).json({ success: false, message: 'Only admins can register teachers or administrators' });
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

// Public routes
router.post('/login', loginRules, login);
router.post('/register', registerRules, allowRegistration, register);
router.get('/me', protect, me);

export default router;