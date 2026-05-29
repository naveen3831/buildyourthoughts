const Settings = require("../models/Settings");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

// GET /api/assets — returns all asset URLs from settings
exports.getAll = async (req, res) => {
  try {
    const items = await Settings.find({ group: "assets" });
    const map = {};
    items.forEach(i => { map[i.key] = i.value; });
    res.json(map);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/assets/upload — admin, upload a static asset to Cloudinary
exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { key } = req.body;
    if (!key) return res.status(400).json({ message: "Asset key required" });

    // Delete old asset from Cloudinary using stored publicId key
    const publicIdKey = `${key}_publicId`;
    const existingPublicId = await Settings.findOne({ key: publicIdKey });
    if (existingPublicId?.value) {
      await cloudinary.uploader.destroy(existingPublicId.value).catch(() => {});
    }

    // Upload new asset
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "speshway/assets",
      transformation: [{ quality: "auto:good" }],
    });

    // Save new URL and publicId to settings
    await Settings.findOneAndUpdate(
      { key },
      { key, label: key, value: result.secure_url, group: "assets", type: "image" },
      { upsert: true, new: true }
    );
    await Settings.findOneAndUpdate(
      { key: publicIdKey },
      { key: publicIdKey, label: publicIdKey, value: result.public_id, group: "assets", type: "text" },
      { upsert: true, new: true }
    );

    res.json({ url: result.secure_url, key });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
