const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const ctrl = require("../controllers/siteContentController");
const SiteContent = require("../models/SiteContent");

const defaults = [
  // Home page
  { key: "stats_title", label: "Stats Section Title", value: "Innovation & Excellence", section: "home" },
  { key: "stats_subtitle", label: "Stats Section Subtitle", value: "End-to-end IT solutions tailored to your business needs, powered by innovation and expertise.", section: "home" },
  { key: "services_label", label: "Services Label", value: "What We Do", section: "home" },
  { key: "services_title", label: "Services Section Title", value: "Innovation & Excellence", section: "home" },
  { key: "portfolio_label", label: "Portfolio Label", value: "Portfolio", section: "home" },
  { key: "portfolio_title", label: "Portfolio Section Title", value: "Our Latest Masterpieces", section: "home" },
  { key: "portfolio_subtitle", label: "Portfolio Subtitle", value: "We build stunning mobile apps and web solutions that redefine user experience.", section: "home" },
  { key: "whyus_label", label: "Why Us Label", value: "Why Choose Us", section: "home" },
  { key: "whyus_title", label: "Why Us Title", value: "Delivering Excellence In Every Project", section: "home" },
  { key: "testimonials_label", label: "Testimonials Label", value: "Testimonials", section: "home" },
  { key: "testimonials_title", label: "Testimonials Title", value: "What Our Clients Say", section: "home" },
  { key: "cta_title", label: "CTA Title", value: "Ready to Transform Your Business?", section: "home" },
  { key: "cta_subtitle", label: "CTA Subtitle", value: "Let's discuss how BUILD YOUR THOUGHTS can accelerate your digital journey and bring your vision to life.", section: "home" },
  // Why Us points (home page)
  { key: "whyus_point1", label: "Why Us Point 1", value: "Custom development tailored to your business needs", section: "home" },
  { key: "whyus_point2", label: "Why Us Point 2", value: "Agile methodology with rapid deployment", section: "home" },
  { key: "whyus_point3", label: "Why Us Point 3", value: "Enterprise-grade security & 99.9% uptime", section: "home" },
  { key: "whyus_point4", label: "Why Us Point 4", value: "Scalable architecture from startup to enterprise", section: "home" },
  { key: "whyus_point5", label: "Why Us Point 5", value: "Transparent communication throughout", section: "home" },
  { key: "whyus_point6", label: "Why Us Point 6", value: "Dedicated post-launch support & maintenance", section: "home" },
  // About page
  { key: "about_mission_title", label: "Mission Title", value: "Our Mission", section: "about" },
  { key: "about_mission_desc", label: "Mission Description", value: "To empower businesses through innovative technology solutions that drive growth, efficiency, and digital transformation.", section: "about" },
  { key: "about_vision_title", label: "Vision Title", value: "Our Vision", section: "about" },
  { key: "about_vision_desc", label: "Vision Description", value: "To be the global leader in IT solutions, recognized for excellence, innovation, and lasting client partnerships.", section: "about" },
  { key: "about_values_title", label: "Values Title", value: "Our Values", section: "about" },
  { key: "about_values_desc", label: "Values Description", value: "Integrity, innovation, excellence, and customer success guide everything we do at BUILD YOUR THOUGHTS.", section: "about" },
  { key: "about_principle1_title", label: "Principle 1 Title", value: "Innovation First", section: "about" },
  { key: "about_principle1_desc", label: "Principle 1 Desc", value: "We stay ahead of the curve with cutting-edge technologies.", section: "about" },
  { key: "about_principle2_title", label: "Principle 2 Title", value: "Client Focused", section: "about" },
  { key: "about_principle2_desc", label: "Principle 2 Desc", value: "Your success is our success. We build lasting partnerships.", section: "about" },
  { key: "about_principle3_title", label: "Principle 3 Title", value: "Global Reach", section: "about" },
  { key: "about_principle3_desc", label: "Principle 3 Desc", value: "Serving clients across India, USA, UK, and Middle East.", section: "about" },
  // Milestones
  { key: "milestone_2017", label: "Milestone 2017", value: "BUILD YOUR THOUGHTS founded with a vision to bridge businesses and technology", section: "about" },
  { key: "milestone_2018", label: "Milestone 2018", value: "First enterprise clients onboarded, team of passionate developers formed", section: "about" },
  { key: "milestone_2020", label: "Milestone 2020", value: "Expanded to mobile development, launched 10+ successful apps", section: "about" },
  { key: "milestone_2022", label: "Milestone 2022", value: "Crossed 30+ clients, opened cloud & AI practice", section: "about" },
  { key: "milestone_2024", label: "Milestone 2024", value: "50+ projects delivered, recognized as top IT solutions provider", section: "about" },
  // Services process steps
  { key: "process_step1_title", label: "Process Step 1 Title", value: "Discovery", section: "services" },
  { key: "process_step1_desc", label: "Process Step 1 Desc", value: "We understand your goals, challenges, and requirements.", section: "services" },
  { key: "process_step2_title", label: "Process Step 2 Title", value: "Planning", section: "services" },
  { key: "process_step2_desc", label: "Process Step 2 Desc", value: "Detailed roadmap, architecture design, and sprint planning.", section: "services" },
  { key: "process_step3_title", label: "Process Step 3 Title", value: "Development", section: "services" },
  { key: "process_step3_desc", label: "Process Step 3 Desc", value: "Agile development with regular demos and feedback loops.", section: "services" },
  { key: "process_step4_title", label: "Process Step 4 Title", value: "Delivery", section: "services" },
  { key: "process_step4_desc", label: "Process Step 4 Desc", value: "Testing, deployment, and post-launch support.", section: "services" },
  // Team culture
  { key: "culture1_title", label: "Culture 1 Title", value: "Collaborative", section: "team" },
  { key: "culture1_desc", label: "Culture 1 Desc", value: "We work as one team, sharing knowledge and lifting each other up.", section: "team" },
  { key: "culture2_title", label: "Culture 2 Title", value: "Excellence", section: "team" },
  { key: "culture2_desc", label: "Culture 2 Desc", value: "We hold ourselves to the highest standards in everything we do.", section: "team" },
  { key: "culture3_title", label: "Culture 3 Title", value: "Inclusive", section: "team" },
  { key: "culture3_desc", label: "Culture 3 Desc", value: "Diverse perspectives make us stronger and more innovative.", section: "team" },
  // Career perks
  { key: "perk1_label", label: "Perk 1", value: "Flexible work hours", section: "career" },
  { key: "perk2_label", label: "Perk 2", value: "Health insurance", section: "career" },
  { key: "perk3_label", label: "Perk 3", value: "Remote-friendly", section: "career" },
  { key: "perk4_label", label: "Perk 4", value: "Learning budget", section: "career" },
];

const seedDefaults = async () => {
  for (const d of defaults) {
    await SiteContent.findOneAndUpdate({ key: d.key }, d, { upsert: true });
  }
};
seedDefaults();

router.get("/", ctrl.getPublic);
router.get("/all", verifyToken, ctrl.getAll);
router.put("/:key", verifyToken, ctrl.updateOne);

module.exports = router;
