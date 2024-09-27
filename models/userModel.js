import { db } from "../config/database.js";
import bcrypt from "bcrypt";

export const createUsersTable = () => {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          email TEXT NOT NULL
      )`,
      (err) => {
        if (err) return reject("Error creating users table", err);
        resolve();
      }
    );
  });
};

export const createUser = async ({ username, password, email }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!username || !password || !email) {
    throw new Error("Username, password, and email are required");
  }

  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email],

      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, username, password, email });
      }
    );
  });
};

export const getUserById = async (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const getUserByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const updateUserById = async (id, { username, email }) => {
  const existingId = await getUserById(id);

  if (!existingId) {
    throw new Error("User not found!");
  }
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, id],
      function (err) {
        if (err) return reject(err);
        resolve({ message: "User updated successfully" });
      }
    );
  });
};

export const deleteUserById = async (id) => {
  const existingId = await getUserById(id);

  if (!existingId) {
    throw new Error("User not found!");
  }

  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve({ message: "User deleted successfully" });
    });
  });
};

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const deleteAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Delete all users from the users table
      db.run("DELETE FROM users", function (err) {
        if (err) return reject(err);

        // Reset the id sequence for the users table
        db.run(
          "DELETE FROM sqlite_sequence WHERE name = 'users'",
          function (err) {
            if (err) return reject(err);

            resolve({
              message: "All users deleted and ID sequence reset successfully",
            });
          }
        );
      });
    });
  });
};
