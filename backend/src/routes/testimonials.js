const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const ctrl = require("../controllers/testimonialController");
const Testimonial = require("../models/Testimonial");

// Seed defaults if none exist
const seed = async () => {
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    await Testimonial.insertMany([
      { name: "Abdul Hameed", role: "CEO, KSA", text: "BuildYourThoughts has designed solutions for my business at very reasonable prices. They are mavens in providing quality services and offering customer support.", rating: 5, order: 0 },
      { name: "Arjun M.", role: "CEO, TechStartup", text: "BuildYourThoughts delivered our platform ahead of schedule with exceptional quality. The team was professional and truly understood our vision.", rating: 5, order: 1 },
      { name: "Ravi K.", role: "Founder, FinEdge", text: "Professional team, transparent process, and outstanding results. They built our fintech app from scratch and it exceeded all expectations.", rating: 5, order: 2 },
    ]);
  }
};
seed();

router.get("/", ctrl.getPublic);
router.get("/all", verifyToken, ctrl.getAll);
router.post("/", verifyToken, ctrl.create);
router.put("/:id", verifyToken, ctrl.update);
router.delete("/:id", verifyToken, ctrl.remove);

module.exports = router;
