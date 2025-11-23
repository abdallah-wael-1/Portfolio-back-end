const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = {
  user: "sa",
  password: "abdallahwael123",
  server: "localhost",
  port: 1433,
  database: "PortfolioDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  try {
    console.log(" Attempting to connect to SQL Server...");
    console.log(`Server: ${dbConfig.server}:${dbConfig.port || "default"}`);
    console.log(`Database: ${dbConfig.database}`);

    pool = await sql.connect(dbConfig);
    console.log(" Connected to SQL Server successfully!");
  } catch (err) {
    console.error(" Database connection failed:");
    console.error(err);
    process.exit(1);
  }
}

connectDB();

app.post("/api/contact", async (req, res) => {
  console.log("\n=== NEW REQUEST ===");
  console.log("📥 Request received at:", new Date().toISOString());
  console.log("📥 Request body:", JSON.stringify(req.body, null, 2));

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    console.log(" Validation failed - missing required fields");
    return res.status(400).json({
      success: false,
      error: "Please fill all required fields",
    });
  }

  if (!pool) {
    console.error(" Pool is null!");
    return res.status(500).json({
      success: false,
      error: "Database connection error - pool is null",
    });
  }

  if (!pool.connected) {
    console.error(" Pool is not connected!");
    return res.status(500).json({
      success: false,
      error: "Database connection error - not connected",
    });
  }

  console.log(" Validation passed");
  console.log(" Database pool is connected");

  try {
    console.log(" Creating database request...");
    const request = pool.request();

    console.log(" Adding input parameters...");
    request.input("name", sql.NVarChar(100), name);
    request.input("email", sql.NVarChar(100), email);
    request.input("phone", sql.NVarChar(20), phone || null);
    request.input("subject", sql.NVarChar(200), subject);
    request.input("message", sql.NVarChar(sql.MAX), message);

    console.log(" Parameters added successfully");

    const query = `
      INSERT INTO ContactMessages (Name, Email, Phone, Subject, Message)
      VALUES (@name, @email, @phone, @subject, @message)
    `;

    console.log(" Executing SQL query...");
    console.log("Query:", query);

    await request.query(query);

    console.log(` SUCCESS! Message saved from: ${name} (${email})`);
    console.log("===================\n");

    res.json({
      success: true,
      message: "Your message has been saved successfully!",
    });
  } catch (err) {
    console.error("\n ERROR OCCURRED");
    console.error("Error Type:", err.constructor.name);
    console.error("Error Name:", err.name);
    console.error("Error Code:", err.code);
    console.error("Error Number:", err.number);
    console.error("Error Message:", err.message);
    console.error("Error Details:", err);
    console.error("Full Stack:", err.stack);
    console.error("===================\n");

    res.status(500).json({
      success: false,
      error: "Database error: " + err.message,
    });
  }
});

app.get("/api/messages", async (req, res) => {
  console.log(" Fetching all messages...");
  try {
    const request = pool.request();
    const result = await request.query(
      "SELECT * FROM ContactMessages ORDER BY CreatedAt DESC"
    );

    console.log(` Retrieved ${result.recordset.length} messages`);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    console.error(" Error fetching messages:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send(" Backend Server is Running!");
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` Waiting for requests...\n`);
});

process.on("SIGINT", async () => {
  console.log("\n Shutting down server...");
  if (pool) await pool.close();
  process.exit(0);
});
