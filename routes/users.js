import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  updatePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(register).post(register).put(register).delete(register);

export default router;
