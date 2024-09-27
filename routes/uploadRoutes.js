import express from "express";
import multer from "multer";
import { uploadCSV } from "../controllers/uploadController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload-csv", upload.single("file"), uploadCSV);

export default router;
