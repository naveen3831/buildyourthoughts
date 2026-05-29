const PhoneShowcase = require("../models/PhoneShowcase");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

exports.getAll = async (req, res) => {
  try {
    const items = await PhoneShowcase.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const items = await PhoneShowcase.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });
    const { label, color, order } = req.body;
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "speshway/phone-showcase",
      transformation: [{ width: 400, height: 800, crop: "limit", quality: "auto:good" }],
    });
    const item = await PhoneShowcase.create({
      image: result.secure_url,
      imagePublicId: result.public_id,
      label: label || "",
      color: color || "primary",
      order: parseInt(order) || 0,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await PhoneShowcase.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    const { label, color, order, isActive } = req.body;
    if (label !== undefined) item.label = label;
    if (color !== undefined) item.color = color;
    if (order !== undefined) item.order = parseInt(order);
    if (isActive !== undefined) item.isActive = isActive === "true" || isActive === true;
    if (req.file) {
      if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId).catch(() => {});
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "speshway/phone-showcase",
        transformation: [{ width: 400, height: 800, crop: "limit", quality: "auto:good" }],
      });
      item.image = result.secure_url;
      item.imagePublicId = result.public_id;
    }
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await PhoneShowcase.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId).catch(() => {});
    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
