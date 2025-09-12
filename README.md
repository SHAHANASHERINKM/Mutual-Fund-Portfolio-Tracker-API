#  Mutual Fund Portfolio Tracker API (Backend)

##  Project Overview
This is a backend system for managing mutual fund portfolios.  
Users can:
- Register and log in
- Add mutual funds to their portfolio
- Track investment performance (profit/loss) in real-time  

The system automatically updates NAV (Net Asset Value) daily using external APIs.

---

## Features
- Authentication with JWT (signup & login)  
- Portfolio Management (add, remove, view holdings, calculate portfolio value)  
- Fund Information APIs (search & view NAV history)  
- Automated NAV Updates (cron job at midnight)  
- Rate Limiting (login, API calls, portfolio updates)  
- Ready for deployment on Render/Vercel  

---

##  Tech Stack
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB + Mongoose  
- **Auth**: JWT  
- **Security**: bcrypt.js (password hashing)  
- **Scheduler**: node-cron (daily NAV updates)  
- **Rate Limiting**: express-rate-limit  
- **External Data**: axios (fetch NAV APIs)  

---

##  Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/SHAHANASHERINKM/Mutual-Fund-Portfolio-Tracker-API
cd mutual-fund-portfolio-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:

```env
MONGO_URI="mongodb+srv://kmshahanasherin_db_user:mutualfund@ cluster0.5mit7by.mongodb.net/"
PORT=5000
JWT_SECRET=secret-jwt
JWT_EXPIRES_IN=24h
```

### 4. Run Seeders
Populate fund & NAV data:
```bash
node seed/fundSeeder.js
node seed/fundNavHistorySeeder.js
node seed/fundLatestNavSeeder.js
```

### 5. Start Server
```bash
npx nodemon app.js   # for development
node app.js          # for production
```

---

##  Authentication APIs

### Signup
**POST** `http://localhost:5000/api/auth/signup`  
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "68c41ed6f018dbc641b0fb32",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
**POST** `http://localhost:5000/api/auth/login`  
Request:
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "68c41ed6f018dbc641b0fb32",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

##  Portfolio APIs (Auth Required)

 Add in headers:
```
Authorization: Bearer <JWT_TOKEN>
```

### Add Fund
**POST** `http://localhost:5000/api/portfolio/add`

Request:
```json
{
  "schemeCode": 100031,
  "units": 200
}
```

Response:
```json
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
```

### Portfolio List
**GET** `http://localhost:5000/api/portfolio/list`

Response:
```json
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
      }
    ]
  }
}
```
## Current Portfolio List


**GET** `http://localhost:5000/api/portfolio/value`

Response: 
```json
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
```


### Get Portfolio History
**GET** ` http://localhost:5000/api/portfolio/history?startDate=01-02-2006&endDate=01-02-2008`
Response:
```json
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
```

### Remove Fund from Portfolio

**DELETE** ` http://localhost:5000/api/portfolio/remove/100027`
Response:
```json
{
    "success": true,
    "message": "Fund removed from portfolio successfully"
}
```

## Fund APIs

### List All Funds
**GET** `http://localhost:5000/api/funds`
Response:
```json
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
```

**GET** `http://localhost:5000/api/funds?search=bluechip&page=1&limit=5`
Response:
```json
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
```


---

## Database Schema

### Users
#### Schema Design
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "passwordHash": String,
  "role": "user" | "admin",
  "createdAt": Date
}
```
#### Sample Document
```json
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
```

### Portfolio
#### Scheme Design:
```json

{
  "_id": ObjectId,
  "userId": ObjectId,   // Reference to Users
  "schemeCode": Number,
  "units": Number,
  "purchaseDate": Date,
  "createdAt": Date
}
```
#### Sample Document:
```json
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
```

### Fund Collection
#### Schema Design:
```json
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
```
#### Sample Document:
```json
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
```

### Fund Latest NAV
#### Schema Design:
```json
{
  "schemeCode": Number,
  "nav": Number,
  "date": String,        
  "updatedAt": Date
}
```
#### Sample Document:
```json
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
```

### Fund NAV History
#### Schema Design:
```json
{
  "schemeCode": Number,
  "nav": Number,
  "date": String,        // "DD-MM-YYYY"
  "createdAt": Date
}
```
#### Sample Document:
```json
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
	```



---

## 📤 Deployment Guide
- Deploy backend to **Render**, **Railway**, or **Vercel**  
- Set environment variables in hosting panel  
- Use monitoring (e.g., Logtail, Datadog) for logs & errors  

---

## 📎 Postman Collection
A full **Postman Collection** (`MutualFundPortfolio.postman_collection.json`) is included for testing all endpoints.
