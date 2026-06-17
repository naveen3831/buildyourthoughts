const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const connectDB = require("../src/config/db");
const Settings = require("../src/models/Settings");

const run = async () => {
  await connectDB();
  
  const seoTitle = "BUILD YOUR THOUGHTS - Software Development & IT Solutions in Hyderabad";
  const seoDescription = "BUILD YOUR THOUGHTS is a leading software development and IT solutions company in Hyderabad, India, specializing in web/mobile apps, cloud, AI, and automation.";
  const seoKeywords = "software development company in hyderabad, IT services in hyderabad, web development company hyderabad, mobile app development hyderabad, cloud solutions hyderabad, AI automation hyderabad, BUILD YOUR THOUGHTS";

  const tRes = await Settings.updateOne({ key: "seo_title" }, { $set: { value: seoTitle } });
  const dRes = await Settings.updateOne({ key: "seo_description" }, { $set: { value: seoDescription } });
  const kRes = await Settings.updateOne({ key: "seo_keywords" }, { $set: { value: seoKeywords } });

  console.log("✅ Database SEO settings updated successfully with Hyderabad keywords!");
  console.log(`Title result: ${JSON.stringify(tRes)}`);
  console.log(`Description result: ${JSON.stringify(dRes)}`);
  console.log(`Keywords result: ${JSON.stringify(kRes)}`);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
