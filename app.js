import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { createProductsTable } from "./models/productModel.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

createProductsTable();

app.use(uploadRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(reportRoutes);
app.use(productRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
