const SiteContent = require("../models/SiteContent");

exports.getPublic = async (req, res) => {
  try {
    const items = await SiteContent.find();
    const map = {};
    items.forEach(i => { map[i.key] = i.value; });
    res.json(map);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await SiteContent.find().sort({ section: 1, key: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const item = await SiteContent.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { returnDocument: "after" }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

