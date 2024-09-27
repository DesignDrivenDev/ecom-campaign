import { db } from "../config/database.js";
import { buildQuery } from "../models/productModel.js";

export const generateReport = (req, res) => {
  const { campaign_name, ad_group_id, fsn_id, product_name } = req.body;

  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (campaign_name) {
    query += " AND campaign_name = ?";
    params.push(campaign_name);
  }
  if (ad_group_id) {
    query += " AND ad_group_id = ?";
    params.push(ad_group_id);
  }
  if (fsn_id) {
    query += " AND fsn_id = ?";
    params.push(fsn_id);
  }
  if (product_name) {
    query += " AND product_name = ?";
    params.push(product_name);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const result = rows.map((row) => {
      const ctr = (row.clicks / row.views) * 100;
      const total_revenue = row.direct_revenue + row.indirect_revenue;
      const total_orders = row.direct_units + row.indirect_units;
      const roas = total_revenue / row.ad_spend;

      return {
        ...row,
        ctr,
        total_revenue,
        total_orders,
        roas,
      };
    });

    res.status(200).json(result);
  });
};

export const getReportByFilter = (filterType) => {
  return (req, res) => {
    const { campaignName, adGroupID, fsnID, productName } = req.body;
    console.log(campaignName, adGroupID, fsnID, productName);
    const primaryFilter = req.body[filterType.toLowerCase()]; // Get the primary filter value
    const filters = {
      campaignName: req.body.campaignName,
      adGroupID: req.body.adGroupID,
      fsnID: req.body.fsnID,
      productName: req.body.productName,
    };

    // Build the SQL query based on the filter type and additional filters
    const { query, params } = buildQuery(primaryFilter, filterType, filters);

    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length)
        return res
          .status(404)
          .json({ message: "No data found for the given filters" });

      res.status(200).json(rows);
    });
  };
};
