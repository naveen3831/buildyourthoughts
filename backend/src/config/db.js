const mongoose = require("mongoose");
const dns = require("dns");

// Force Google DNS to resolve MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "speshway",
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,           // Force IPv4
      maxPoolSize: 10,     // Keep up to 10 connections open
      minPoolSize: 2,      // Always keep 2 warm connections ready
      maxIdleTimeMS: 30000, // Close idle connections after 30s
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("💡 Make sure your IP is whitelisted in MongoDB Atlas Network Access.");
    process.exit(1);
  }
};

module.exports = connectDB;
