import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByUsername } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid username or password" });

    const token =
      "Bearer " + jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
