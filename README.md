E-commerce Campaign Reporting API
This project provides APIs for uploading product campaign data from a CSV file, JWT-based authentication, and filtering product data using multiple cross-filters (Campaign Name, Ad Group ID, FSN ID, Product Name).

Features
CSV File Upload to SQLite Database
User Authentication (JWT)
Product Reporting with Cross-Filtering
CRUD Operations for Users
Secure Password Storage (bcrypt)
JWT Middleware for Protected Routes
Setup Instructions
Clone the repository:

bash

git clone https://github.com/DesignDrivenDev/ecom-campaign.git
cd /ecom-campaign-campaign

Install Dependencies:
npm install
Environment Variables: Create a .env file with the following values:


JWT_SECRET=your_jwt_secret
Start the Server:

npm start
Run SQLite Migrations: Make sure the necessary tables (users, products) are created in the SQLite database:

javascript

// Call the table creation function in your project
createUsersTable();
createProductsTable();

API Endpoints
1. Upload CSV File to SQLite
Endpoint: POST /upload-csv
Description: Uploads a CSV file and populates the products table in the SQLite database.
Body: form-data with a file upload (csv file).

3. User Management APIs
Create User:

Endpoint: POST /users
Body:json
{
  "username": "user1",
  "password": "password",
  "email": "user1@example.com"
}
Login and Generate JWT Token:

Endpoint: POST /login
Body:json
{
  "username": "user1",
  "password": "password"
}
Response: A JWT token is generated for the user.
3. JWT-Protected User API
Get User By ID (Requires Token):
Endpoint: GET /users/:id
Headers: Authorization: Bearer <token>
4. Product Reporting APIs with Cross-Filtering
Each of the following routes can filter data by the primary filter (e.g., Campaign Name, Ad Group ID) and apply additional filters like FSN ID or Product Name.

API 1: Campaign Name Filter
Endpoint: POST /products/report/campaign
Body:json
{
  "campaignName": "PLA-Cross selling-Dalda 1L",
  "adGroupID": "RZPNNZ8LY3PP",
  "fsnID": "EDOFCSBGHFQ9YKAA",
  "productName": "Dalda Kachi Ghani Mustard Oil PET Bottle"
}
API 2: Ad Group ID Filter
Endpoint: POST /products/report/adGroupID
Body:json
{
  "adGroupID": "RZPNNZ8LY3PP",
  "campaignName": "PLA-Cross selling-Dalda 1L"
}
API 3: FSN ID Filter
Endpoint: POST /products/report/fsnID
Body:
json

{
  "fsnID": "EDOFCSBGHFQ9YKAA"
}
API 4: Product Name Filter
Endpoint: POST /products/report/productName
Body:
json

{
  "productName": "Dalda Kachi Ghani Mustard Oil PET Bottle"
}
5. Get All Products
Endpoint: GET /products
Description: Fetch all product data from the database.
Response Example:
json
[
  {
    "id": 1,
    "campaignName": "PLA-Cross selling-Dalda 1L",
    "adGroupID": "RZPNNZ8LY3PP",
    "fsnID": "EDOFCSBGHFQ9YKAA",
    "productName": "Dalda Kachi Ghani Mustard Oil PET Bottle",
    "adSpend": 2089.6,
    "views": 89396,
    "clicks": 464,
    "directUnits": 236,
    "indirectUnits": 102,
    "directRevenue": 31244,
    "indirectRevenue": 15939
  }
]
Notes
Ensure SQLite is properly configured before running.
Use Postman or similar tools to test the API endpoints.
JWT token is required for some routes. Use the /login route to get the token and pass it as Authorization: Bearer <token> in headers.
