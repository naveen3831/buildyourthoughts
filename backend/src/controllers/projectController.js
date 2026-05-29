const Project = require("../models/Project");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, category, description, tech, liveUrl, features, status, client, order } = req.body;
    let image = "", imagePublicId = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "speshway/projects",
        transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto:good" }],
      });
      image = result.secure_url;
      imagePublicId = result.public_id;
    }
    const project = await Project.create({
      title, category, description,
      tech: tech ? JSON.parse(tech) : [],
      features: features ? JSON.parse(features) : [],
      liveUrl: liveUrl || "",
      status: status || "In Progress",
      client: client || "",
      order: order || 0,
      image,
      imagePublicId,
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });
    const { title, category, description, tech, liveUrl, features, status, client, order } = req.body;
    const updates = {
      title, category, description,
      tech: tech ? JSON.parse(tech) : existing.tech,
      features: features ? JSON.parse(features) : existing.features,
      liveUrl: liveUrl || existing.liveUrl,
      status: status || existing.status,
      client: client || existing.client,
      order: order !== undefined ? order : existing.order,
    };
    if (req.file) {
      if (existing.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "speshway/projects",
        transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto:good" }],
      });
      updates.image = result.secure_url;
      updates.imagePublicId = result.public_id;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.imagePublicId) await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
