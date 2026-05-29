const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const CarouselSlide = require('../models/CarouselSlide');
const TeamMember = require('../models/TeamMember');
const PhoneShowcase = require('../models/PhoneShowcase');
const Settings = require('../models/Settings');

const OLD_CLOUD = 'djjimbk12';
const NEW_CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const OLD_DOMAIN = `res.cloudinary.com/${OLD_CLOUD}`;
const NEW_DOMAIN = `res.cloudinary.com/${NEW_CLOUD}`;

async function replaceInCollection(model, fieldPaths) {
  const docs = await model.find({}).lean().exec();
  let changed = 0;
  for (const doc of docs) {
    const updates = {};
    for (const pathKey of fieldPaths) {
      const val = doc[pathKey];
      if (typeof val === 'string' && val.includes(OLD_DOMAIN)) {
        updates[pathKey] = val.replace(OLD_DOMAIN, NEW_DOMAIN);
      }
    }
    if (Object.keys(updates).length) {
      await model.findByIdAndUpdate(doc._id, updates);
      changed++;
      console.log(`Updated ${model.modelName} ${doc._id}:`, updates);
    }
  }
  return changed;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts' });
  let total = 0;

  total += await replaceInCollection(Project, ['image']);
  total += await replaceInCollection(BlogPost, ['image']);
  total += await replaceInCollection(CarouselSlide, ['image']);
  total += await replaceInCollection(TeamMember, ['image']);
  total += await replaceInCollection(PhoneShowcase, ['image']);

  // Settings: check value field for assets and image types
  const settings = await Settings.find({}).lean().exec();
  let settingsChanged = 0;
  for (const s of settings) {
    if (typeof s.value === 'string' && s.value.includes(OLD_DOMAIN)) {
      const newVal = s.value.replace(OLD_DOMAIN, NEW_DOMAIN);
      await Settings.findByIdAndUpdate(s._id, { value: newVal });
      settingsChanged++;
      console.log(`Updated Settings ${s.key}: ${newVal}`);
    }
  }
  total += settingsChanged;

  console.log(`\nReplacement complete. Total documents updated: ${total}`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
