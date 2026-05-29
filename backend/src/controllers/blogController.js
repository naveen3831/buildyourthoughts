const BlogPost = require("../models/BlogPost");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

exports.getPublic = async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: "Published" }).sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, excerpt, content, tag, author, readTime, status, featured, order } = req.body;
    let image = "", imagePublicId = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "buildyourthoughts/blog",
        transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto:good" }],
      });
      image = result.secure_url;
      imagePublicId = result.public_id;
    }
    const post = await BlogPost.create({
      title, excerpt, content: content || "",
      tag: tag || "General", author: author || "Build Your Thoughts Team",
      readTime: readTime || "5 min",
      status: status || "Published",
      featured: featured === "true" || featured === true,
      order: order || 0,
      image,
      imagePublicId,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await BlogPost.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });
    const { title, excerpt, content, tag, author, readTime, status, featured, order } = req.body;
    const updates = {
      title, excerpt, content: content || "",
      tag: tag || "General", author: author || "Build Your Thoughts Team",
      readTime: readTime || "5 min",
      status: status || "Published",
      featured: featured === "true" || featured === true,
      order: order || 0,
    };
    if (req.file) {
      if (existing.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "buildyourthoughts/blog",
        transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto:good" }],
      });
      updates.image = result.secure_url;
      updates.imagePublicId = result.public_id;
    }
    const post = await BlogPost.findByIdAndUpdate(req.params.id, updates, { returnDocument: "after" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (post.imagePublicId) await cloudinary.uploader.destroy(post.imagePublicId).catch(() => {});
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

