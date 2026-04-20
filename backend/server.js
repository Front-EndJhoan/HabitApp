import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


import habitsRoutes from "./routes/habits.js";
import authRoutes from "./routes/auth.js";  // ← necesitas crear este archivo

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/+$/, ""))
  : [
      "http://localhost:5173",
      "https://habit-app-iota-nine.vercel.app",  // sin barra al final
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Normaliza el origin recibido también (por si acaso)
    const normalizedOrigin = origin?.replace(/\/+$/, "");
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${normalizedOrigin} not allowed`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/habits", habitsRoutes);  // ← añade /api
app.use("/api/auth", authRoutes);      // ← añade /api y las rutas de auth

mongoose.connect(process.env.MONGO_URL, { family: 4 })
  .then(() => console.log("DB conectada"))
  .catch(err => console.log(err));

app.listen(3000, () => console.log("Servidor corriendo"));