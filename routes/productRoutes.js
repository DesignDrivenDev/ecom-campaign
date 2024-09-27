import express from "express";
import { getAllProductsFromDB, getAllProduct } from "../models/productModel.js";
const router = express.Router();

router.get("/products", getAllProductsFromDB);

export default router;
