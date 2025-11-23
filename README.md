# 📦 Portfolio Backend API

Backend server for the personal **Portfolio Website**, built using **Node.js**, **Express**, and **SQL Server**. This backend is responsible for handling Contact Form submissions and storing them securely in the database.


## 🚀 **Features**

*  RESTful API built with **Express.js**
*  Connects to **SQL Server (SSMS)** using `mssql`
*  Stores contact form messages
*  Handles validation & error logging
*  Secure database connection


## 🛠️ **Tech Stack**

* **Node.js**
* **MSSQL (SQL Server)**


## 🔗 **API Endpoints**

### ➤ **POST /api/contact**

Stores a new message in the database.

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0100000000",
  "subject": "Hello",
  "message": "This is a test message"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Your message has been saved successfully!"
}
```

---

### ➤ **GET /api/messages**

Returns all saved messages ordered by date.

**Response:**

```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## 🗄️ **Database Structure**

### 📌 Table: `ContactMessages`

| Column    | Type          |
| --------- | ------------- |
| Id        | INT (PK)      |
| Name      | NVARCHAR(100) |
| Email     | NVARCHAR(100) |
| Phone     | NVARCHAR(20)  |
| Subject   | NVARCHAR(200) |
| Message   | NVARCHAR(MAX) |
| CreatedAt | DATETIME      |

---

## ⚙️ **Environment Variables**

Create a `.env` file and add:

```
PORT=5000
DB_USER=sa
DB_PASSWORD=******
DB_NAME=PortfolioDB
DB_SERVER=localhost
DB_PORT=1433
```


## **Author**
 
**Abdullah Wael** — Computer Science Student

