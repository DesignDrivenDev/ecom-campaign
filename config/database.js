import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./ecommerce-campaign.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database");
  }
});

export { db };
