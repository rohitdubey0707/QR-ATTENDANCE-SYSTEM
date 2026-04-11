import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();


// ------ Database ------
connectDB();


// ------ CORS (FIXED & SAFE) ------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://qr-attendance-system-vert.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests like Postman or server-to-server (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);


// ------ Middlewares ------
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));


// ------ Rate Limiting ------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
});
app.use(globalLimiter);


// ------ Routes ------
app.get("/", (req, res) =>
  res.json({ status: "ok", service: "QR Attendance API" })
);

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", userRoutes);


// ------ Error Handler ------
app.use(errorHandler);


// ------ Server ------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});