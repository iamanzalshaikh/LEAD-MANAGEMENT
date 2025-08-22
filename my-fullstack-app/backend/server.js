// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import leadRouter from "./routes/leadRoute.js";
import salesRouter from "./routes/salesRoute.js";
import assignmentRouter from "./routes/assigmentRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";


// Load environment variables first
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS middleware with credentials support

app.use(cors({
  origin: "https://leatmanagement.netlify.app", // include https://
  credentials: true, // allow cookies if needed
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes (uncomment when ready)

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/leads", leadRouter);
app.use("/api/sales", salesRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/dashboard", dashboardRouter);


// Test route
app.get("/", (req, res) => {
  res.send("LMT Backend API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
