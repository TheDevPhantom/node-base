import express from "express";
import {
  CreateUsers,
  DeleteUser,
  EditUser,
  GetUser,
  GetUsers,
} from "../controllers/users.controller.js";
import { protect } from "../middleware/auth.js";
import filteredResults from "../middleware/filteredResults.js";
import User from "../models/User.js";

const router = express.Router();

router
  .route("/")
  .get(filteredResults(User), GetUsers)
  .post(protect, CreateUsers);
router
  .route("/:id")
  .get(GetUser)
  .put(protect, EditUser)
  .delete(protect, DeleteUser);

export default router;
