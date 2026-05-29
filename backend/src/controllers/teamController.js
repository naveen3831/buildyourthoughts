const TeamMember = require("../models/TeamMember");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

exports.getPublic = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(members);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, role, bio, initials, gradient, linkedin, github, twitter, email, order } = req.body;
    let image = "", imagePublicId = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "buildyourthoughts/team",
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto:good" }],
      });
      image = result.secure_url;
      imagePublicId = result.public_id;
    }
    const member = await TeamMember.create({
      name, role, bio: bio || "",
      initials: initials || name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      gradient: gradient || "from-primary to-accent",
      linkedin: linkedin || "", github: github || "", twitter: twitter || "", email: email || "",
      order: order || 0,
      image,
      imagePublicId,
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await TeamMember.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });
    const { name, role, bio, initials, gradient, linkedin, github, twitter, email, order, isActive } = req.body;
    const updates = {
      name, role, bio: bio || "",
      initials: initials || (name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : existing.initials),
      gradient: gradient || existing.gradient,
      linkedin: linkedin || "", github: github || "", twitter: twitter || "", email: email || "",
      order: order || 0,
      isActive: isActive === "true" || isActive === true,
    };
    if (req.file) {
      if (existing.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "buildyourthoughts/team",
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto:good" }],
      });
      updates.image = result.secure_url;
      updates.imagePublicId = result.public_id;
    }
    const member = await TeamMember.findByIdAndUpdate(req.params.id, updates, { returnDocument: "after" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Not found" });
    if (member.imagePublicId) await cloudinary.uploader.destroy(member.imagePublicId).catch(() => {});
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

