// Entry point: bootstraps Express app, security middlewares, routes, and error handling.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';


import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';


dotenv.config();


const app = express();

// CORS
let corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
if (corsOrigin.includes(',')) {
	corsOrigin = corsOrigin.split(',').map(origin => origin.trim());
}
app.use(cors({ origin: corsOrigin, credentials: true }));


// ------ Database ------
connectDB();


// ------ Middlewares ------
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));


// Basic rate limiting (tightened on sensitive routes as needed)
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(globalLimiter);


// ------ Routes ------
app.get('/', (req, res) => res.json({ status: 'ok', service: 'QR Attendance API' }));
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);


// ------ Error Handler ------
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));