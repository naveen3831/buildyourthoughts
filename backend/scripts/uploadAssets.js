/**
 * Upload ALL frontend local assets to Cloudinary + save URLs to MongoDB.
 * Run: node scripts/uploadAssets.js  (backend must be running on port 5000)
 */

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ASSETS_DIR = path.join(__dirname, "../../frontend/src/assets");
const API = "http://localhost:5000/api";

const assets = [
  // Site images
  { file: "about-team.jpg",       folder: "buildyourthoughts/assets",   key: "asset_about_team",       label: "About / Team Photo" },
  { file: "web-showcase.png",     folder: "buildyourthoughts/assets",   key: "asset_web_showcase",     label: "Web Showcase Image" },
  { file: "logo-buildyourthoughts.png",    folder: "buildyourthoughts/assets",   key: "asset_logo",             label: "Site Logo" },
  { file: "logo.png",             folder: "buildyourthoughts/assets",   key: "asset_logo_alt",         label: "Site Logo Alt" },
  { file: "mobile-showcase.png",  folder: "buildyourthoughts/assets",   key: "asset_mobile_showcase",  label: "Mobile Showcase" },
  { file: "hero-bg.jpg",          folder: "buildyourthoughts/assets",   key: "asset_hero_bg",          label: "Hero Background" },
  // Hero carousel slides
  { file: "hero-slide-1.jpg",     folder: "buildyourthoughts/carousel", key: "asset_hero_slide_1",     label: "Hero Slide 1" },
  { file: "hero-slide-2.jpg",     folder: "buildyourthoughts/carousel", key: "asset_hero_slide_2",     label: "Hero Slide 2" },
  { file: "hero-slide-3.jpg",     folder: "buildyourthoughts/carousel", key: "asset_hero_slide_3",     label: "Hero Slide 3" },
  // Phone screen images
  { file: "phone-ecommerce.png",  folder: "buildyourthoughts/phones",   key: "asset_phone_ecommerce",  label: "Phone - Ecommerce" },
  { file: "phone-fintech.png",    folder: "buildyourthoughts/phones",   key: "asset_phone_fintech",    label: "Phone - Fintech" },
  { file: "phone-fitness.png",    folder: "buildyourthoughts/phones",   key: "asset_phone_fitness",    label: "Phone - Fitness" },
  { file: "phone-food.png",       folder: "buildyourthoughts/phones",   key: "asset_phone_food",       label: "Phone - Food" },
  { file: "phone-health.png",     folder: "buildyourthoughts/phones",   key: "asset_phone_health",     label: "Phone - Health" },
  { file: "phone-social.png",     folder: "buildyourthoughts/phones",   key: "asset_phone_social",     label: "Phone - Social" },
];

async function getToken() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error("Login failed: " + JSON.stringify(data));
  return data.token;
}

async function saveToDb(token, key, label, url) {
  const res = await fetch(`${API}/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ value: url }),
  });
  if (!res.ok) {
    // Fallback: bulk update
    await fetch(`${API}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [key]: url }),
    });
  }
}

async function run() {
  console.log("🔐 Authenticating...");
  const token = await getToken();
  console.log("✅ Authenticated\n🚀 Uploading all assets to Cloudinary...\n");

  let success = 0, skipped = 0, failed = 0;

  for (const asset of assets) {
    const filePath = path.join(ASSETS_DIR, asset.file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipped (not found): ${asset.file}`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`⬆️  ${asset.file.padEnd(25)} `);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: asset.folder,
        public_id: path.parse(asset.file).name,
        overwrite: true,
        transformation: [{ quality: "auto:good" }],
      });
      await saveToDb(token, asset.key, asset.label, result.secure_url);
      console.log(`✅  ${result.secure_url}`);
      success++;
    } catch (err) {
      console.error(`❌  Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${success} uploaded, ${skipped} skipped, ${failed} failed`);
  console.log("🎉 All assets stored in Cloudinary + URLs saved to MongoDB!");
}

run().catch(console.error);
