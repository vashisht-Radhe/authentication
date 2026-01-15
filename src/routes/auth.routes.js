import express from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", protect, me);

export default authRoutes;
