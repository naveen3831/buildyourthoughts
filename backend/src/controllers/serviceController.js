const Service = require("../models/Service");

exports.getPublic = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(services);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, icon, color, features, order } = req.body;
    const service = await Service.create({
      title, description,
      icon: icon || "Code",
      color: color || "primary",
      features: Array.isArray(features) ? features : (features ? features.split("\n").map(f => f.trim()).filter(Boolean) : []),
      order: order || 0,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, icon, color, features, order, isActive } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title, description,
        icon: icon || "Code",
        color: color || "primary",
        features: Array.isArray(features) ? features : (features ? features.split("\n").map(f => f.trim()).filter(Boolean) : []),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: "Not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
