const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const { login, verify } = require("../controllers/authController");

// Seed default admins on startup
const seedAdmins = async () => {
  try {
    const admins = [
      { name: "Srikanth Siddani", email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
      { name: "R Chara", email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2 },
    ].filter((admin) => admin.email && admin.password);

    const emails = [];
    for (const admin of admins) {
      const hashed = bcrypt.hashSync(admin.password, 10);
      await Admin.findOneAndUpdate(
        { email: admin.email },
        { name: admin.name, email: admin.email, password: hashed, role: "Super Admin", isActive: true },
        { upsert: true, returnDocument: "after" }
      );
      emails.push(admin.email);
      console.log("✅ Admin ready:", admin.email);
    }

    if (emails.length) {
      await Admin.updateMany(
        { email: { $nin: emails } },
        { isActive: false }
      );
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};
seedAdmins();

router.post("/login", login);
router.post("/verify", verify);

module.exports = router;

