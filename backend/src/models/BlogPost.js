const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    tag: { type: String, default: "General" },
    author: { type: String, default: "Build Your Thoughts Team" },
    readTime: { type: String, default: "5 min" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    status: { type: String, enum: ["Published", "Draft"], default: "Published" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
