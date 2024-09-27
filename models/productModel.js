import { db } from "../config/database.js";
export const createProductsTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaignName TEXT,
    adGroupID TEXT,
    fsnID TEXT,
    productName TEXT,
    adSpend REAL,
    views INTEGER,
    clicks INTEGER,
    directRevenue REAL,
    indirectRevenue REAL,
    directUnits INTEGER,
    indirectUnits INTEGER
  )`);
};

// export const createProductsTable = () => {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `CREATE TABLE IF NOT EXISTS products (
//             id INTEGER PRIMARY KEY,
//             campaign_name TEXT,
//             ad_group_id TEXT,
//             fsn_id TEXT,
//             product_name TEXT,
//             ad_spend REAL,
//             views INTEGER,
//             clicks INTEGER,
//             direct_revenue REAL,
//             indirect_revenue REAL,
//             direct_units INTEGER,
//             indirect_units INTEGER
//         )`,
//       (err) => {
//         if (err) return reject(err);
//         resolve();
//       }
//     );
//   });
// };

// export const insertProduct = (productData) => {
//   return new Promise((resolve, reject) => {
//     const {
//       campaign_name,
//       ad_group_id,
//       fsn_id,
//       product_name,
//       ad_spend,
//       views,
//       clicks,
//       direct_revenue,
//       indirect_revenue,
//       direct_units,
//       indirect_units,
//     } = productData;

//     db.run(
//       `INSERT INTO products (
//             campaign_name, ad_group_id, fsn_id, product_name, ad_spend,
//             views, clicks, direct_revenue, indirect_revenue, direct_units, indirect_units
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         campaign_name,
//         ad_group_id,
//         fsn_id,
//         product_name,
//         ad_spend,
//         views,
//         clicks,
//         direct_revenue,
//         indirect_revenue,
//         direct_units,
//         indirect_units,
//       ],
//       function (err) {
//         if (err) return reject(err);
//         resolve();
//       }
//     );
//   });
// };

export const getProductReport = (queryParams) => {
  const { campaign_name, ad_group_id, fsn_id, product_name } = queryParams;
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

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const buildQuery = (primaryFilter, filterType, filters = {}) => {
  let query = `SELECT 
                  CampaignName,
                  AdGroupID,
                  FSNID,
                  ProductName,
                  SUM(AdSpend) AS totalAdSpend,
                  SUM(Views) AS totalViews,
                  SUM(Clicks) AS totalClicks,
                  SUM(DirectRevenue + IndirectRevenue) AS totalRevenue,
                  SUM(DirectUnits + IndirectUnits) AS totalUnits,
                  (SUM(Clicks) * 100.0) / SUM(Views) AS CTR,
                  SUM(DirectRevenue + IndirectRevenue) / SUM(AdSpend) AS ROAS
               FROM products WHERE ${filterType} = ?`;

  // Add additional filters if provided
  if (filters.campaignName)
    query += ` AND CampaignName = '${filters.campaignName}'`;
  if (filters.adGroupID) query += ` AND AdGroupID = '${filters.adGroupID}'`;
  if (filters.fsnID) query += ` AND FSNID = '${filters.fsnID}'`;
  if (filters.productName)
    query += ` AND ProductName = '${filters.productName}'`;

  // Group by the primary filter
  query += ` GROUP BY ${filterType}`;
  return { query, params: [primaryFilter] };
};

export const getAllProductsFromDB = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

export const getAllProduct = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// export const insertProduct = (productData) => {
//   return new Promise((resolve, reject) => {
//     const {
//       "Campaign ID": campaign_id,
//       "Campaign Name": campaign_name,
//       "Ad Group ID": ad_group_id,
//       "FSN ID": fsn_id,
//       "Product Name": product_name,
//       "Ad Spend": ad_spend,
//       Views: views,
//       Clicks: clicks,
//       "Direct Units": direct_units,
//       "Indirect Units": indirect_units,
//       "Direct Revenue": direct_revenue,
//       "Indirect Revenue": indirect_revenue,
//     } = productData;

//     // Convert string values to appropriate types (e.g., numbers)
//     const ad_spend_number = parseFloat(ad_spend);
//     const views_number = parseInt(views, 10);
//     const clicks_number = parseInt(clicks, 10);
//     const direct_units_number = parseInt(direct_units, 10);
//     const indirect_units_number = parseInt(indirect_units, 10);
//     const direct_revenue_number = parseFloat(direct_revenue);
//     const indirect_revenue_number = parseFloat(indirect_revenue);

//     db.run(
//       `INSERT INTO products (
//             campaign_id, campaign_name, ad_group_id, fsn_id, product_name, ad_spend,
//             views, clicks, direct_units, indirect_units, direct_revenue, indirect_revenue
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         campaign_id,
//         campaign_name,
//         ad_group_id,
//         fsn_id,
//         product_name,
//         ad_spend_number,
//         views_number,
//         clicks_number,
//         direct_units_number,
//         indirect_units_number,
//         direct_revenue_number,
//         indirect_revenue_number,
//       ],
//       function (err) {
//         if (err) return reject(err);
//         resolve();
//       }
//     );
//   });
// };

// Insert product into the products table
export const insertProduct = (productData) => {
  return new Promise((resolve, reject) => {
    const {
      "Campaign ID": campaign_id,
      "Campaign Name": campaign_name,
      "Ad Group ID": ad_group_id,
      "FSN ID": fsn_id,
      "Product Name": product_name,
      "Ad Spend": ad_spend,
      Views: views,
      Clicks: clicks,
      "Direct Units": direct_units,
      "Indirect Units": indirect_units,
      "Direct Revenue": direct_revenue,
      "Indirect Revenue": indirect_revenue,
    } = productData;

    const mappedProductData = {
      campaignName: campaign_name,
      adGroupID: ad_group_id,
      fsnID: fsn_id,
      productName: product_name,
      adSpend: parseFloat(ad_spend),
      views: parseInt(views, 10),
      clicks: parseInt(clicks, 10),
      directRevenue: parseFloat(direct_revenue),
      indirectRevenue: parseFloat(indirect_revenue),
      directUnits: parseInt(direct_units, 10),
      indirectUnits: parseInt(indirect_units, 10),
    };

    db.run(
      `INSERT INTO products (
        campaignName, adGroupID, fsnID, productName, adSpend,
        views, clicks, directRevenue, indirectRevenue, directUnits, indirectUnits
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(mappedProductData),
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};
