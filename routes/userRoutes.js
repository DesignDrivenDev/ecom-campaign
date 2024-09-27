import express from "express";
import {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsersFromDB,
  getAllUsersFromTable,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/users", registerUser);
router.get("/users/:id", authenticateToken, getUser);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);
router.delete("/delete-all", authenticateToken, deleteAllUsersFromDB);
router.get("/all-users", authenticateToken, getAllUsersFromTable);

export default router;
