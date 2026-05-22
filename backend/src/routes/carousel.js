const express = require("express");
const router = express.Router();
const { uploadCarousel } = require("../config/cloudinary");
const { verifyToken } = require("../middleware/auth");
const ctrl = require("../controllers/carouselController");
const CarouselSlide = require("../models/CarouselSlide");

// Seed default slides if none exist
const seedSlides = async () => {
  const count = await CarouselSlide.countDocuments();
  if (count === 0) {
    await CarouselSlide.insertMany([
      { badge: "Welcome to the Future of IT", title: "Build Your Digital Future", highlight: "BUILD YOUR THOUGHTS", desc: "Full-stack software, automation, and IT solutions that drive real business growth.", ctaText: "Our Services", ctaLink: "/services", cta2Text: "Get in Touch", cta2Link: "/contact", order: 0 },
      { badge: "Mobile App Development", title: "Stunning Mobile Apps", highlight: "For Every Platform", desc: "We build beautiful, high-performance mobile applications for iOS and Android.", ctaText: "View Projects", ctaLink: "/projects", cta2Text: "Get a Quote", cta2Link: "/contact", order: 1 },
      { badge: "Cloud & Security Solutions", title: "Secure & Scalable", highlight: "Cloud Infrastructure", desc: "Enterprise-grade cybersecurity and cloud solutions to protect and grow your business.", ctaText: "Learn More", ctaLink: "/services", cta2Text: "Contact Us", cta2Link: "/contact", order: 2 },
    ]);
    console.log("✅ Carousel slides seeded");
  }
};
seedSlides();

router.get("/", ctrl.getPublic);
router.get("/all", verifyToken, ctrl.getAll);
router.post("/", verifyToken, uploadCarousel.single("image"), ctrl.create);
router.put("/:id", verifyToken, uploadCarousel.single("image"), ctrl.update);
router.patch("/:id/toggle", verifyToken, ctrl.toggle);
router.delete("/:id", verifyToken, ctrl.remove);

module.exports = router;
