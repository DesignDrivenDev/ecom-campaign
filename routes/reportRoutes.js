import express from "express";
import {
  generateReport,
  getReportByFilter,
} from "../controllers/reportController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/products/report", authenticateToken, generateReport);

router.post("/products/report/campaign", getReportByFilter("CampaignName"));

// Filter by Ad Group ID
router.post("/products/report/adGroupID", getReportByFilter("AdGroupID"));

// Filter by FSN ID
router.post("/products/report/fsnID", getReportByFilter("FSNID"));

// Filter by Product Name
router.post("/products/report/productName", getReportByFilter("ProductName"));

export default router;
