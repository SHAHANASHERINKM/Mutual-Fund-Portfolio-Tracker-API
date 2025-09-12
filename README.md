Mutual Fund Portfolio Tracker API(Backend)
Project Overview
This is a backend system for managing mutual fund portfolios.
Users can register, log in, add mutual funds to their portfolio, and track their investment performance (profit/loss) in real-time.
The system automatically updates NAV (Net Asset Value) daily using external APIs.
Features:

Authentication with JWT (signup & login)
Portfolio Management (add, remove, view holdings, calculate portfolio value)
Fund Information APIs (search & view NAV history)
Automated NAV Updates (cron job at midnight)
Rate Limiting (login, API calls, portfolio updates)
Ready for deployment on Render/Vercel

Tech Stack:
Node.js + Express.js (API backend)
MongoDB + Mongoose (database)
JWT (authentication)
bcrypt.js (password hashing)
node-cron (daily NAV update jobs)
express-rate-limit (API rate limiting)
axios (fetch external NAV APIs)

Setup Instructions:
1.Clone Repository
Git repo

2.Install Dependencies
npm install

3.Setup Environment Variables

MONGO_URI="mongodb+srv://kmshahanasherin_db_user:mutualfund@ cluster0.5mit7by.mongodb.net/"
PORT=5000
JWT_SECRET=secret-jwt
JWT_EXPIRES_IN=24h
4.Run Seeders

Populate fund & NAV data:
node seed/fundSeeder.js
node seed/fundNavHistorySeeder.js
node seed/fundLatestNavSeeder.js

5.Start Server
npx nodemon app.js  # with nodemon
node app.js     # normal start


Authentication APIs
Signup
POST http://localhost:5000/api/auth/signup
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}

Response:
{
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzQxZWQ2ZjAxOGRiYzY0MWIwZmIzMiIsImlhdCI6MTc1NzY4MzQxNCwiZXhwIjoxNzU3NzY5ODE0fQ.MVD-E8QT1dAlgdBbPYq0jIPnROXIA5LsoM6U_H10CNw",
    "user": {
        "id": "68c41ed6f018dbc641b0fb32",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    }
}

Login

POST  http://localhost:5000/api/auth/login
Request:
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}

Response:
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzQxZWQ2ZjAxOGRiYzY0MWIwZmIzMiIsImlhdCI6MTc1NzY4MzQ2OCwiZXhwIjoxNzU4Mjg4MjY4fQ.Md-37rmJBCVHvQMFflSmZL2mQCcIJem6nk1Jxz1D61U",
    "user": {
        "id": "68c41ed6f018dbc641b0fb32",
        "name": "John Doe",
        "email": "john@example.com"
    }
}


Portfolio APIs (Auth Required)

Include in Headers:
Authorization: Bearer <JWT_TOKEN>

Add Fund to Portfolio

 POST    http://localhost:5000/api/portfolio/add
Request:
{
"schemeCode": 100031,
"units": 200
}
Response:
{
    "success": true,
    "message": "Fund added to portfolio successfully",
    "portfolio": {
        "id": "68c426c117c69457ff8c8369",
        "schemeCode": 100031,
        "schemeName": "Grindlays Super Saver Income Fund-GSSIF - ST-Dividend",
        "units": 200,
        "addedAt": "2025-09-12T13:57:21.812Z"
    }
}

Get Portfolio List

GET http://localhost:5000/api/portfolio/list
Response:
{
    "success": true,
    "data": {
        "totalHoldings": 2,
        "holdings": [
            {
                "schemeCode": 100031,
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF - ST-Dividend",
                "units": 200,
                "currentNav": 20,
                "currentValue": 4000
            },
            {
                "schemeCode": 100027,
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Half Yearly Dividend",
                "units": 200,
                "currentNav": 10.7205,
                "currentValue": 2144.1
            }
        ]
    }
}

Get Current Portfolio Value

GET http://localhost:5000/api/portfolio/value
Response:
{
    "success": true,
    "data": {
        "totalInvestment": 6144.1,
        "currentValue": 6144.1,
        "profitLoss": 0,
        "profitLossPercent": 0,
        "asOn": "29-05-2008",
        "holdings": [
            {
                "schemeCode": 100031,
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF - ST-Dividend",
                "units": 200,
                "currentNav": 20,
                "currentValue": 4000,
                "investedValue": 4000,
                "profitLoss": 0
            },
            {
                "schemeCode": 100027,
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Half Yearly Dividend",
                "units": 200,
                "currentNav": 10.7205,
                "currentValue": 2144.1,
                "investedValue": 2144.1,
                "profitLoss": 0
            }
        ]
    }
}

Get Portfolio History
GET http://localhost:5000/api/portfolio/history?startDate=01-02-2006&endDate=01-02-2008
Response:
{
    "success": true,
    "data": [
        {
            "date": "01-02-2008",
            "totalValue": 2012.7,
            "profitLoss": 2012.7
        }
    ]
}


Remove Fund from Portfolio

DELETE http://localhost:5000/api/portfolio/remove/100027
Response:
{
    "success": true,
    "message": "Fund removed from portfolio successfully"
}

Fund APIs

List All Funds
GET http://localhost:5000/api/funds
Response:
{
    "success": true,
    "data": {
        "funds": [
            {
                "_id": "68c2da1085c57f2d0fde3ddd",
                "schemeCode": 100027,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Half Yearly Dividend",
                "schemeType": ""
            },
            {
                "_id": "68c2da1085c57f2d0fde3dde",
                "schemeCode": 100028,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Quaterly Dividend",
                "schemeType": ""
            },
            {
                "_id": "68c2da1085c57f2d0fde3ddf",
                "schemeCode": 100029,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Growth",
                "schemeType": ""
            },
            {
                "_id": "68c2da1085c57f2d0fde3de0",
                "schemeCode": 100030,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Annual Dividend",
                "schemeType": ""
            },
            {
                "_id": "68c2da1085c57f2d0fde3de1",
                "schemeCode": 100031,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF - ST-Dividend",
                "schemeType": ""
            },
            {
                "_id": "68c2da1085c57f2d0fde3de2",
                "schemeCode": 100032,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Grindlays Super Saver Income Fund-GSSIF - ST-Growth",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de3",
                "schemeCode": 100033,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Large & Mid Cap Fund - Regular Growth",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de4",
                "schemeCode": 100034,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Large & Mid Cap Fund -Regular - IDCW",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de5",
                "schemeCode": 100035,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Birla Sun Life Freedom Fund-Plan A (Dividend)",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de6",
                "schemeCode": 100036,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Birla Sun Life Freedom Fund-Plan B (Growth)",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de7",
                "schemeCode": 100037,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Income Fund - Regular - Quarterly IDCW",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de8",
                "schemeCode": 100038,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Income Fund - Growth - Regular Plan",
                "schemeType": ""
            },
            {
                "_id": "68c2da1185c57f2d0fde3de9",
                "schemeCode": 100041,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund -Institutional - IDCW",
                "schemeType": ""
            },
            {
                "_id": "68c2da1285c57f2d0fde3dea",
                "schemeCode": 100042,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund-Retail (Growth)",
                "schemeType": ""
            },
            {
                "_id": "68c2da1285c57f2d0fde3deb",
                "schemeCode": 100043,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund-Institutional (Growth)",
                "schemeType": ""
            },
            {
                "_id": "68c2da1285c57f2d0fde3dec",
                "schemeCode": 100044,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund -Retail - IDCW",
                "schemeType": ""
            },
            {
                "_id": "68c2da1285c57f2d0fde3ded",
                "schemeCode": 100046,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund -Daily IDCW",
                "schemeType": ""
            },
            {
                "_id": "68c2da1285c57f2d0fde3dee",
                "schemeCode": 100047,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund - Growth",
                "schemeType": ""
            },
            {
                "_id": "68c2da1285c57f2d0fde3def",
                "schemeCode": 100048,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Liquid Fund -Institutional - weekly  IDCW",
                "schemeType": ""
            },
            {
                "_id": "68c2da1385c57f2d0fde3df0",
                "schemeCode": 100049,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "Aditya Birla Sun Life Cash Plus-Institutional - Fortnightly Dividend",
                "schemeType": ""
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 96,
            "totalFunds": 1911,
            "hasNext": true,
            "hasPrev": false
        }
    }
}

GET http://localhost:5000/api/funds?search=bluechip&page=1&limit=5
Response:
{
    "success": true,
    "data": {
        "funds": [
            {
                "_id": "68c2daf885c57f2d0fde44cb",
                "schemeCode": 103455,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "UTI Bluechip Flexicap Fund - Regular Plan - Dividend Option",
                "schemeType": ""
            },
            {
                "_id": "68c2daf985c57f2d0fde44cc",
                "schemeCode": 103457,
                "fundHouse": "",
                "schemeCategory": "",
                "schemeName": "UTI Bluechip Flexicap Fund - Regular Plan - Growth option",
                "schemeType": ""
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalFunds": 2,
            "hasNext": false,
            "hasPrev": false
        }
    }
}


Database Schema
1.Users
Scheme Design:
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "passwordHash": String,
  "role": String,   // "user" | "admin"
  "createdAt": Date
}
Sample Document:
{
  "_id": {
    "$oid": "68c41ed6f018dbc641b0fb32"
  },
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "$2b$10$XU7VBr23IUB54eSxY7s7tugmNRsATDTT.M6zy7f1EVrnyJ2hO5g2C",
  "role": "user",
  "createdAt": {
    "$date": "2025-09-12T13:23:34.572Z"
  },
  "updatedAt": {
    "$date": "2025-09-12T13:23:34.572Z"
  },
  "__v": 0
}

2.Portfolio
Scheme Design:

{
  "_id": ObjectId,
  "userId": ObjectId,   // Reference to Users
  "schemeCode": Number,
  "units": Number,
  "purchaseDate": Date,
  "createdAt": Date
}
Sample Document:
{
  "_id": {
    "$oid": "68c426c117c69457ff8c8369"
  },
  "userId": {
    "$oid": "68c41ed6f018dbc641b0fb32"
  },
  "schemeCode": 100031,
  "units": 200,
  "purchaseDate": {
    "$date": "2025-09-12T13:57:21.807Z"
  },
  "createdAt": {
    "$date": "2025-09-12T13:57:21.812Z"
  },
  "__v": 0
}

3.Fund Collection
Schema Design:
{
  "schemeCode": Number,
  "schemeName": String,
  "isinGrowth": String,
  "isinDivReinvestment": String,
  "fundHouse": String,
  "schemeType": String,
  "schemeCategory": String,
  "createdAt": Date,
  "updatedAt": Date
}
Sample Document:
{
  "_id": {
    "$oid": "68c2da1085c57f2d0fde3ddd"
  },
  "schemeCode": 100027,
  "__v": 0,
  "createdAt": {
    "$date": "2025-09-11T14:18:39.148Z"
  },
  "fundHouse": "",
  "isinDivReinvestment": "",
  "isinGrowth": "",
  "schemeCategory": "",
  "schemeName": "Grindlays Super Saver Income Fund-GSSIF-Half Yearly Dividend",
  "schemeType": "",
  "updatedAt": {
    "$date": "2025-09-11T14:18:39.148Z"
  }
}

4.Fund Latest NAV collection
Schema Design:
{
  "schemeCode": Number,
  "nav": Number,
  "date": String,        // "DD-MM-YYYY"
  "updatedAt": Date
}
Sample Document:
{
  "_id": {
    "$oid": "68c39ddf85c57f2d0fde478a"
  },
  "schemeCode": 100031,
  "__v": 0,
  "date": "29-05-2008",
  "nav": 20,
  "updatedAt": {
    "$date": "2025-09-12T06:03:03.177Z"
  }
}

5.Fund NAV History Collection
Schema Design:
{
  "schemeCode": Number,
  "nav": Number,
  "date": String,        // "DD-MM-YYYY"
  "createdAt": Date
}
Sample Document:
{
  "_id": {
    "$oid": "68c2f3d085c57f2d0fde455d"
  },
  "schemeCode": 100031,
  "date": "29-05-2008",
  "__v": 0,
  "createdAt": {
    "$date": "2025-09-11T16:08:31.018Z"
  },
  "nav": 10.1053
}
	

