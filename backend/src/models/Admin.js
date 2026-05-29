const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Build Your Thoughts Admin" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // stored as bcrypt hash
    role: { type: String, default: "Super Admin" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
