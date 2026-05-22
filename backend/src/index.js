const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const contactRoutes = require("./routes/contact");
const projectRoutes = require("./routes/projects");
const serviceRoutes = require("./routes/services");
const siteContentRoutes = require("./routes/siteContent");
const carouselRoutes = require("./routes/carousel");
const jobRoutes = require("./routes/jobs");
const teamRoutes = require("./routes/team");
const blogRoutes = require("./routes/blog");
const settingsRoutes = require("./routes/settings");
const testimonialRoutes = require("./routes/testimonials");
const assetRoutes = require("./routes/assets");
const phoneShowcaseRoutes = require("./routes/phoneShowcase");
const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// CORS — allow frontend dev server and production domains
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    // Allow localhost on any port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
    // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    if (/^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(origin)) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any subdomain of the production domain
    const prodDomain = process.env.FRONTEND_URL;
    if (prodDomain && origin.endsWith(new URL(prodDomain).hostname)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Serve admin static files
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/phone-showcase", phoneShowcaseRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);

// Catch-all: serve admin index for /admin/* (SPA routing)
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/index.html"));
});

app.get("/", (req, res) => {
  res.json({ message: "BUILD YOUR THOUGHTS API is running", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
});
