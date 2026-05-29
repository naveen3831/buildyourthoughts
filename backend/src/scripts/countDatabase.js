const path = require('path');
const dns = require('dns');

// Match backend DNS defaults for Atlas SRV resolution
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

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts' });
  const counts = await Promise.all([
    Project.countDocuments(),
    BlogPost.countDocuments(),
    CarouselSlide.countDocuments(),
    TeamMember.countDocuments(),
    PhoneShowcase.countDocuments(),
    JobApplication.countDocuments(),
    Settings.countDocuments(),
  ]);
  console.log('counts:', {
    projects: counts[0],
    blogPosts: counts[1],
    carouselSlides: counts[2],
    teamMembers: counts[3],
    phoneShowcase: counts[4],
    jobApplications: counts[5],
    settings: counts[6],
  });
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
