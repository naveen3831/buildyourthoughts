const path = require("path");
const fs = require("fs/promises");
const dns = require("dns");
const mongoose = require("mongoose");
// Load environment first so config modules pick up updated values
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");
const Project = require("../models/Project");
const BlogPost = require("../models/BlogPost");
const CarouselSlide = require("../models/CarouselSlide");
const TeamMember = require("../models/TeamMember");
const PhoneShowcase = require("../models/PhoneShowcase");
const JobApplication = require("../models/JobApplication");
const Settings = require("../models/Settings");


dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const CURRENT_CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const CURRENT_CLOUD_DOMAIN = `res.cloudinary.com/${CURRENT_CLOUD}`;

const isCloudinaryUrl = (value) => typeof value === "string" && value.includes("cloudinary.com") && value.includes(CURRENT_CLOUD_DOMAIN);
const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//.test(value);

async function uploadImageSource(source, folderOrConfig, localBase = path.join(__dirname, "../../")) {
  if (!source) return null;
  if (isCloudinaryUrl(source)) return { url: source };

  const cfg = typeof folderOrConfig === 'string' ? { folder: folderOrConfig } : (folderOrConfig || {});
  const config = {
    folder: cfg.folder,
    transformation: [{ quality: "auto:good" }],
  };
  if (cfg.resourceType || cfg.resource_type) {
    config.resource_type = cfg.resourceType || cfg.resource_type;
  }

  try {
    if (isHttpUrl(source)) {
      if (config.resource_type === 'raw') {
        const res = await fetch(source);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Derive a clean public_id from the remote filename to avoid weird extensions
        try {
          const parsed = new URL(source);
          const rawName = decodeURIComponent(parsed.pathname.split('/').pop() || 'file');
          let filename = rawName.replace(/\s+/g, '_');
          // Normalize odd double extensions like .pdf.docx -> .docx
          filename = filename.replace(/\.pdf\.docx$/i, '.docx');
          filename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
          config.public_id = `${cfg.folder}/${nameWithoutExt}`;
        } catch (e) {
          // ignore filename parsing errors
        }

        const result = await uploadToCloudinary(buffer, config);
        return { url: result.secure_url, publicId: result.public_id };
      }
      const result = await cloudinary.uploader.upload(source, config);
      return { url: result.secure_url, publicId: result.public_id };
    }

    const candidatePath = path.isAbsolute(source) ? source : path.join(localBase, source);
    const buffer = await fs.readFile(candidatePath);
    const result = await uploadToCloudinary(buffer, config);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error(`Failed to upload source [${source}] to Cloudinary:`, err.message);
    return null;
  }
}

function mapSource(value) {
  if (!value || typeof value !== "string") return null;
  if (isCloudinaryUrl(value)) return null;
  return value;
}

async function migrateCollection(sourceModel, targetModel, query, fieldMap) {
  const items = await sourceModel.find(query).lean().exec();
  console.log(`Migrating ${items.length} documents from ${sourceModel.modelName}...`);

  for (const item of items) {
    let hasUpdate = false;
    const updates = {};

    for (const [field, config] of Object.entries(fieldMap)) {
      const source = item[field];
      const uploadSource = mapSource(source);
      if (!uploadSource) continue;

      const result = await uploadImageSource(uploadSource, config.folder);
      if (result && result.url) {
        updates[field] = result.url;
        if (config.publicIdField && result.publicId) {
          updates[config.publicIdField] = result.publicId;
        }
        hasUpdate = true;
        console.log(`  [${sourceModel.modelName}] ${item._id} ${field} uploaded to Cloudinary.`);
      }
    }

    const targetData = { ...item, ...updates };
    delete targetData.__v;

    if (sourceModel === targetModel) {
      if (hasUpdate) {
        await targetModel.findByIdAndUpdate(item._id, updates, { returnDocument: "after" });
      }
    } else {
      await targetModel.findOneAndUpdate(
        { _id: item._id },
        targetData,
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }
  }
}

async function migrateSettings(sourceSettings, targetSettings) {
  const settings = await sourceSettings.find({ type: "image" }).lean().exec();
  console.log(`Migrating ${settings.length} image settings...`);
  for (const setting of settings) {
    const uploadSource = mapSource(setting.value);
    const targetData = { ...setting };
    const result = uploadSource ? await uploadImageSource(uploadSource, "buildyourthoughts/settings") : null;
    if (result && result.url) {
      targetData.value = result.url;
      console.log(`  [Settings] ${setting.key} updated.`);
    }
    await targetSettings.findOneAndUpdate(
      { key: setting.key },
      targetData,
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }
}

async function migrateAssets(sourceSettings, targetSettings) {
  const assets = await sourceSettings.find({ group: "assets" }).lean().exec();
  console.log(`Migrating ${assets.length} asset records...`);
  for (const asset of assets) {
    const uploadSource = mapSource(asset.value);
    const targetData = { ...asset };
    if (uploadSource) {
      const result = await uploadImageSource(uploadSource, "buildyourthoughts/assets");
      if (result && result.url) {
        targetData.value = result.url;
        console.log(`  [Asset] ${asset.key} updated.`);
      }
    }
    await targetSettings.findOneAndUpdate(
      { key: asset.key },
      targetData,
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }
}

async function run() {
  const SOURCE_MONGO_URI = process.env.SOURCE_MONGO_URI || process.env.MONGO_URI;
  const TARGET_MONGO_URI = process.env.TARGET_MONGO_URI || process.env.MONGO_URI;
  const sameDb = SOURCE_MONGO_URI === TARGET_MONGO_URI;

  console.log(`Source DB: ${SOURCE_MONGO_URI}`);
  console.log(`Target DB: ${TARGET_MONGO_URI}`);

  const sourceConn = await mongoose.createConnection(SOURCE_MONGO_URI, {
    dbName: "buildyourthoughts",
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  });
  const targetConn = sameDb
    ? sourceConn
    : await mongoose.createConnection(TARGET_MONGO_URI, {
        dbName: "buildyourthoughts",
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      });

  const SourceProject = sourceConn.model("Project", Project.schema);
  const TargetProject = sameDb ? SourceProject : targetConn.model("Project", Project.schema);
  const SourceBlogPost = sourceConn.model("BlogPost", BlogPost.schema);
  const TargetBlogPost = sameDb ? SourceBlogPost : targetConn.model("BlogPost", BlogPost.schema);
  const SourceCarouselSlide = sourceConn.model("CarouselSlide", CarouselSlide.schema);
  const TargetCarouselSlide = sameDb ? SourceCarouselSlide : targetConn.model("CarouselSlide", CarouselSlide.schema);
  const SourceTeamMember = sourceConn.model("TeamMember", TeamMember.schema);
  const TargetTeamMember = sameDb ? SourceTeamMember : targetConn.model("TeamMember", TeamMember.schema);
  const SourcePhoneShowcase = sourceConn.model("PhoneShowcase", PhoneShowcase.schema);
  const TargetPhoneShowcase = sameDb ? SourcePhoneShowcase : targetConn.model("PhoneShowcase", PhoneShowcase.schema);
  const SourceJobApplication = sourceConn.model("JobApplication", JobApplication.schema);
  const TargetJobApplication = sameDb ? SourceJobApplication : targetConn.model("JobApplication", JobApplication.schema);
  const SourceSettings = sourceConn.model("Settings", Settings.schema);
  const TargetSettings = sameDb ? SourceSettings : targetConn.model("Settings", Settings.schema);

  await migrateCollection(SourceProject, TargetProject, {}, {
    image: { folder: "buildyourthoughts/projects", publicIdField: "imagePublicId" },
  });

  await migrateCollection(SourceBlogPost, TargetBlogPost, {}, {
    image: { folder: "buildyourthoughts/blog", publicIdField: "imagePublicId" },
  });

  await migrateCollection(SourceCarouselSlide, TargetCarouselSlide, {}, {
    image: { folder: "buildyourthoughts/carousel", publicIdField: "imagePublicId" },
  });

  await migrateCollection(SourceTeamMember, TargetTeamMember, {}, {
    image: { folder: "buildyourthoughts/team", publicIdField: "imagePublicId" },
  });

  await migrateCollection(SourcePhoneShowcase, TargetPhoneShowcase, {}, {
    image: { folder: "buildyourthoughts/phone-showcase", publicIdField: "imagePublicId" },
  });

  await migrateCollection(SourceJobApplication, TargetJobApplication, {}, {
    resumeUrl: { folder: "buildyourthoughts/resumes", resource_type: 'raw' },
  });

  await migrateSettings(SourceSettings, TargetSettings);
  await migrateAssets(SourceSettings, TargetSettings);

  console.log("Migration complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

