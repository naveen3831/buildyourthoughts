const Testimonial = require("../models/Testimonial");

exports.getPublic = async (req, res) => {
  try {
    const items = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, role, text, rating, order } = req.body;
    const item = await Testimonial.create({
      name, role, text,
      rating: Number(rating) || 5,
      order: Number(order) || 0,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, role, text, rating, isActive, order } = req.body;
    const updates = {
      name,
      role,
      text,
      rating: Number(rating),
      order: Number(order) || 0,
    };
    if (isActive !== undefined) updates.isActive = isActive;
    const item = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: "after" }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

