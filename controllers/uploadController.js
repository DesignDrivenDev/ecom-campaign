// import fs from "fs";
// import csv from "csv-parser";
// import { insertProduct } from "../models/productModel.js";

// export const uploadCSV = async (req, res) => {
//   const filePath = req.file.path;

//   console.log(filePath, "<<<<filepath uploadCSV");

//   try {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", async (row) => {
//         await insertProduct(row);
//         console.log(row, "<<<<row");
//       })
//       .on("end", () => {
//         res.status(200).json({ message: "CSV data uploaded successfully" });
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

import fs from "fs";
import csv from "csv-parser";
import { insertProduct } from "../models/productModel.js"; // Ensure this path is correct

// export const uploadCSV = async (req, res) => {
//   const filePath = req.file.path;

//   try {
//     // Use a promise to ensure all rows are processed before responding
//     const products = [];

//     console.log(products, "<<<<products");

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", async (row) => {
//         products.push(row);
//         // console.log(row,"<<<row")
//       })
//       .on("end", async () => {
//         try {
//           // Insert each row into the database
//           for (const product of products) {
//             await insertProduct(product);
//             console.log(product, "<<<row");
//           }

//           // File processing completed
//           res.status(200).json({ message: "CSV data uploaded successfully" });
//         } catch (error) {
//           res
//             .status(500)
//             .json({ error: "Error inserting data into the database" });
//         } finally {
//           // Delete the uploaded file after processing
//           fs.unlink(filePath, (err) => {
//             if (err) console.error("Error deleting file:", err);
//           });
//         }
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const uploadCSV = async (req, res) => {
  const filePath = req.file.path;

  try {
    const products = [];

    // Read the CSV file and collect rows
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        products.push(row);
      })
      .on("end", async () => {
        try {
          // Insert each product into the database
          for (const product of products) {
            await insertProduct(product);
          }

          res.status(200).json({ message: "CSV data uploaded successfully" });
        } catch (error) {
          res.status(500).json({
            error: error.message || "Error inserting data into the database",
            context: "Database Insertion",
          });
        } finally {
          // Delete file after processing
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
      })
      .on("error", (error) => {
        res.status(500).json({
          error: error.message || "Error reading CSV file",
          context: "CSV Parsing",
        });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
