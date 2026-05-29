const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const ctrl = require("../controllers/settingsController");
const Settings = require("../models/Settings");

const defaults = [
  { key: "site_name", label: "Site Name", value: "BUILD YOUR THOUGHTS", group: "site", type: "text" },
  { key: "site_tagline", label: "Tagline", value: "Innovation & Ideas", group: "site", type: "text" },
  { key: "site_description", label: "Site Description", value: "Full-stack software, automation, and IT solutions that drive real business growth.", group: "site", type: "textarea" },
  { key: "contact_email", label: "Email", value: "info@buildyourthoughts.com", group: "contact", type: "text", preserveValueUnlessMatches: ["info@speshway.com"] },
  { key: "contact_phone", label: "Phone", value: "+91 9100006020", group: "contact", type: "text" },
  { key: "contact_address", label: "Address", value: "T-Hub, Plot No 1/C, Sy No 83/1, Raidurgam, Knowledge City Rd, Hyderabad, Telangana 500032", group: "contact", type: "textarea" },
  { key: "contact_whatsapp", label: "WhatsApp Number", value: "919100006020", group: "contact", type: "text" },
  { key: "social_facebook", label: "Facebook URL", value: "", group: "social", type: "url" },
  { key: "social_twitter", label: "Twitter URL", value: "", group: "social", type: "url" },
  { key: "social_linkedin", label: "LinkedIn URL", value: "", group: "social", type: "url" },
  { key: "social_instagram", label: "Instagram URL", value: "", group: "social", type: "url" },
  { key: "social_youtube", label: "YouTube URL", value: "", group: "social", type: "url" },
  { key: "seo_title", label: "SEO Title", value: "BUILD YOUR THOUGHTS - IT Services & Software Development", group: "seo", type: "text" },
  { key: "seo_description", label: "SEO Meta Description", value: "BUILD YOUR THOUGHTS provides full-stack software development, cloud solutions, AI & automation services.", group: "seo", type: "textarea" },
  { key: "seo_keywords", label: "SEO Keywords", value: "software development, IT solutions, mobile apps, cloud, AI, Hyderabad", group: "seo", type: "text" },
  { key: "home_stats_title", label: "Stats Section Title", value: "Innovation & Excellence", group: "home", type: "text" },
  { key: "home_services_label", label: "Services Label", value: "What We Do", group: "home", type: "text" },
  { key: "home_services_title", label: "Services Title", value: "Innovation & Excellence", group: "home", type: "text" },
  { key: "home_whyus_label", label: "Why Us Label", value: "Why Choose Us", group: "home", type: "text" },
  { key: "home_whyus_title", label: "Why Us Title", value: "Delivering Excellence In Every Project", group: "home", type: "text" },
  { key: "home_cta_title", label: "CTA Title", value: "Ready to Transform Your Business?", group: "home", type: "text" },
  { key: "home_cta_subtitle", label: "CTA Subtitle", value: "Let's discuss how BUILD YOUR THOUGHTS can accelerate your digital journey.", group: "home", type: "textarea" },
  { key: "footer_copyright", label: "Footer Copyright Text", value: "BUILD YOUR THOUGHTS. All rights reserved.", group: "appearance", type: "text" },
  { key: "maintenance_mode", label: "Maintenance Mode", value: "false", group: "appearance", type: "toggle" },
  { key: "color_primary", label: "Primary Color", value: "#0b78d2", group: "appearance", type: "color" },
  { key: "color_secondary", label: "Secondary Color", value: "#12b5ff", group: "appearance", type: "color" },
  { key: "color_accent", label: "Accent Color", value: "#0ec9ff", group: "appearance", type: "color" },
  { key: "site_theme", label: "Site Theme", value: "dark", group: "appearance", type: "text" },
  { key: "hero_highlight_color", label: "Hero Highlight Color", value: "#0b78d2", group: "appearance", type: "color" },
  { key: "stat_projects", label: "Stat — Projects", value: "100", group: "stats", type: "text" },
  { key: "stat_projects_suffix", label: "Stat — Projects Suffix", value: "+", group: "stats", type: "text" },
  { key: "stat_clients", label: "Stat — Clients", value: "76", group: "stats", type: "text" },
  { key: "stat_clients_suffix", label: "Stat — Clients Suffix", value: "+", group: "stats", type: "text" },
  { key: "stat_team", label: "Stat — Team", value: "200", group: "stats", type: "text" },
  { key: "stat_team_suffix", label: "Stat — Team Suffix", value: "+", group: "stats", type: "text" },
  { key: "stat_experience", label: "Stat — Experience", value: "9", group: "stats", type: "text" },
  { key: "stat_experience_suffix", label: "Stat — Experience Suffix", value: "+", group: "stats", type: "text" },
  { key: "whyus_point1", label: "Why Us Point 1", value: "Custom development tailored to your business needs", group: "stats", type: "text" },
  { key: "whyus_point2", label: "Why Us Point 2", value: "Agile methodology with rapid deployment", group: "stats", type: "text" },
  { key: "whyus_point3", label: "Why Us Point 3", value: "Enterprise-grade security & 99.9% uptime", group: "stats", type: "text" },
  { key: "whyus_point4", label: "Why Us Point 4", value: "Scalable architecture from startup to enterprise", group: "stats", type: "text" },
  { key: "whyus_point5", label: "Why Us Point 5", value: "Transparent communication throughout", group: "stats", type: "text" },
  { key: "whyus_point6", label: "Why Us Point 6", value: "Dedicated post-launch support & maintenance", group: "stats", type: "text" },
  { key: "whyus_stat1_val", label: "Why Us Stat 1 Value", value: "99%", group: "stats", type: "text" },
  { key: "whyus_stat1_label", label: "Why Us Stat 1 Label", value: "Satisfaction", group: "stats", type: "text" },
  { key: "whyus_stat2_val", label: "Why Us Stat 2 Value", value: "24/7", group: "stats", type: "text" },
  { key: "whyus_stat2_label", label: "Why Us Stat 2 Label", value: "Support", group: "stats", type: "text" },
  { key: "whyus_stat3_val", label: "Why Us Stat 3 Value", value: "100+", group: "stats", type: "text" },
  { key: "whyus_stat3_label", label: "Why Us Stat 3 Label", value: "Tech Stack", group: "stats", type: "text" },
  { key: "whyus_stat4_val", label: "Why Us Stat 4 Value", value: "50+", group: "stats", type: "text" },
  { key: "whyus_stat4_label", label: "Why Us Stat 4 Label", value: "Partners", group: "stats", type: "text" },
  { key: "proj_stat1_val", label: "Projects Stat 1", value: "50+", group: "stats", type: "text" },
  { key: "proj_stat1_label", label: "Projects Stat 1 Label", value: "Projects Delivered", group: "stats", type: "text" },
  { key: "proj_stat2_val", label: "Projects Stat 2", value: "30+", group: "stats", type: "text" },
  { key: "proj_stat2_label", label: "Projects Stat 2 Label", value: "Happy Clients", group: "stats", type: "text" },
  { key: "proj_stat3_val", label: "Projects Stat 3", value: "98%", group: "stats", type: "text" },
  { key: "proj_stat3_label", label: "Projects Stat 3 Label", value: "On-Time Delivery", group: "stats", type: "text" },
  { key: "proj_stat4_val", label: "Projects Stat 4", value: "4.9★", group: "stats", type: "text" },
  { key: "proj_stat4_label", label: "Projects Stat 4 Label", value: "Average Rating", group: "stats", type: "text" },
];

// Seed — insert missing keys only, preserve existing values
const seedSettings = async () => {
  for (const d of defaults) {
    const existing = await Settings.findOne({ key: d.key });
    if (!existing) {
      await Settings.create(d);
    } else {
      const update = { label: d.label, group: d.group, type: d.type };
      if (d.preserveValueUnlessMatches && d.preserveValueUnlessMatches.includes(existing.value)) {
        update.value = d.value;
      }
      await Settings.updateOne({ key: d.key }, { $set: update });
    }
  }
};
seedSettings();

router.get("/", ctrl.getPublic);
router.get("/all", verifyToken, ctrl.getAll);
router.put("/", verifyToken, ctrl.updateBulk);
router.put("/:key", verifyToken, ctrl.updateOne);

module.exports = router;
