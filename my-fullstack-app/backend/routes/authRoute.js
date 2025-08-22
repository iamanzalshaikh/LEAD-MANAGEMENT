import express from "express";
import { login, logout, signup } from "../controller/authController.js"; 

const authRouter = express.Router();

// Auth routes
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

export default authRouter;
