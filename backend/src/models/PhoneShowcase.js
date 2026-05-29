const mongoose = require("mongoose");

const phoneShowcaseSchema = new mongoose.Schema({
  image: { type: String, required: true },
  imagePublicId: { type: String, default: "" }, // Cloudinary public_id for deletion
  label: { type: String, default: "" },
  color: { type: String, enum: ["primary", "secondary", "accent"], default: "primary" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("PhoneShowcase", phoneShowcaseSchema);
