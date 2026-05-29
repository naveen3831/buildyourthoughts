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
const Settings = require('../models/Settings');

const CURRENT_CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const CURRENT_DOMAIN = `res.cloudinary.com/${CURRENT_CLOUD}`;

function isCloudUrl(value) {
  return typeof value === 'string' && value.includes(CURRENT_DOMAIN);
}

function needsUpload(value) {
  if (!value) return true;
  if (typeof value !== 'string') return true;
  if (value.includes('cloudinary.com')) return !value.includes(CURRENT_DOMAIN);
  return true; // local path or other host
}

async function scan() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts' });

  const results = {};

  const projects = await Project.find({}).lean().exec();
  results.projects = projects.filter(p => needsUpload(p.image)).slice(0, 10);

  const blogs = await BlogPost.find({}).lean().exec();
  results.blogPosts = blogs.filter(b => needsUpload(b.image)).slice(0, 10);

  const carousel = await CarouselSlide.find({}).lean().exec();
  results.carousel = carousel.filter(c => needsUpload(c.image)).slice(0, 10);

  const team = await TeamMember.find({}).lean().exec();
  results.team = team.filter(t => needsUpload(t.image)).slice(0, 10);

  const phones = await PhoneShowcase.find({}).lean().exec();
  results.phoneShowcase = phones.filter(p => needsUpload(p.image)).slice(0, 10);

  const jobs = await JobApplication.find({}).lean().exec();
  results.jobApplications = jobs.filter(j => needsUpload(j.resumeUrl)).slice(0, 10);

  const settings = await Settings.find({}).lean().exec();
  results.settings = settings.filter(s => (s.type === 'image' || s.group === 'assets') && needsUpload(s.value)).slice(0, 20);

  console.log('\nScan results for assets not in Cloudinary (or not in current cloud):');
  for (const [k, v] of Object.entries(results)) {
    console.log(`\n-- ${k} (${v.length}) --`);
    v.forEach(doc => console.log(JSON.stringify(doc, null, 2)));
  }

  process.exit(0);
}

scan().catch(err => { console.error(err); process.exit(1); });
