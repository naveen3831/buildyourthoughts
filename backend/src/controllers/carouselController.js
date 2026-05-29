const CarouselSlide = require("../models/CarouselSlide");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

exports.getPublic = async (req, res) => {
  try {
    const slides = await CarouselSlide.find({ isActive: true }).sort({ order: 1 }).lean();
    res.json(slides);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const slides = await CarouselSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { badge, title, highlight, desc, ctaText, ctaLink, cta2Text, cta2Link, order, image: bodyImage, imagePublicId: bodyPublicId } = req.body;
    let image = bodyImage || "", imagePublicId = bodyPublicId || "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "buildyourthoughts/carousel",
        transformation: [{ width: 1920, height: 1080, crop: "limit", quality: "auto:good" }],
      });
      image = result.secure_url;
      imagePublicId = result.public_id;
    }
    const slide = await CarouselSlide.create({
      badge, title, highlight, desc,
      ctaText: ctaText || "Learn More",
      ctaLink: ctaLink || "/services",
      cta2Text: cta2Text || "Contact Us",
      cta2Link: cta2Link || "/contact",
      order: order || 0,
      image,
      imagePublicId,
      highlightGradient: req.body.highlightGradient || "purple-blue-cyan-orange",
    });
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await CarouselSlide.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });
    const { badge, title, highlight, desc, ctaText, ctaLink, cta2Text, cta2Link, order, isActive } = req.body;
    const updates = { badge, title, highlight, desc, ctaText, ctaLink, cta2Text, cta2Link, order, isActive: isActive === "true" || isActive === true, highlightGradient: req.body.highlightGradient || existing.highlightGradient || "purple-blue-cyan-orange" };
    if (req.file) {
      if (existing.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "buildyourthoughts/carousel",
        transformation: [{ width: 1920, height: 1080, crop: "limit", quality: "auto:good" }],
      });
      updates.image = result.secure_url;
      updates.imagePublicId = result.public_id;
    }
    const slide = await CarouselSlide.findByIdAndUpdate(req.params.id, updates, { returnDocument: "after" });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggle = async (req, res) => {
  try {
    const slide = await CarouselSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Not found" });
    const updated = await CarouselSlide.findByIdAndUpdate(req.params.id, { isActive: !slide.isActive }, { returnDocument: "after" });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const slide = await CarouselSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Not found" });
    if (slide.imagePublicId) await cloudinary.uploader.destroy(slide.imagePublicId).catch(() => {});
    await CarouselSlide.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

