import {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  createUsersTable,
  deleteAllUsers,
  getAllUsers,
} from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    await createUsersTable();

    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await updateUserById(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAllUsersFromDB = async (req, res) => {
  try {
    const result = await deleteAllUsers();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsersFromTable = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
