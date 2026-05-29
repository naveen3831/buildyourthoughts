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
const JobApplication = require('../models/JobApplication');

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts' });

  const sample = {};

  sample.projects = await Project.find({}, { title: 1, image: 1, imagePublicId: 1 }).limit(5).lean().exec();
  sample.blogPosts = await BlogPost.find({}, { title: 1, image: 1, imagePublicId: 1 }).limit(5).lean().exec();
  sample.carousel = await CarouselSlide.find({}, { caption: 1, image: 1, imagePublicId: 1 }).limit(5).lean().exec();
  sample.team = await TeamMember.find({}, { name: 1, image: 1, imagePublicId: 1 }).limit(5).lean().exec();
  sample.phoneShowcase = await PhoneShowcase.find({}, { title: 1, image: 1, imagePublicId: 1 }).limit(5).lean().exec();
  sample.jobApplications = await JobApplication.find({}, { name: 1, resumeUrl: 1 }).limit(5).lean().exec();

  console.log('\n=== Cloudinary Samples ===\n');
  for (const [k, v] of Object.entries(sample)) {
    console.log(`-- ${k} (${v.length}) --`);
    v.forEach((doc) => console.log(JSON.stringify(doc, null, 2)));
    console.log('');
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
