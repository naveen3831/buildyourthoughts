const path = require('path');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const mongoose = require('mongoose');
const Project = require('./src/models/Project');
const BlogPost = require('./src/models/BlogPost');
const CarouselSlide = require('./src/models/CarouselSlide');
const TeamMember = require('./src/models/TeamMember');
const PhoneShowcase = require('./src/models/PhoneShowcase');
const Settings = require('./src/models/Settings');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'speshway', serverSelectionTimeoutMS: 10000 });
  const old = 'djjimbk12';
  const collections = [
    { model: Project, name: 'Project', fields: ['image'] },
    { model: BlogPost, name: 'BlogPost', fields: ['image'] },
    { model: CarouselSlide, name: 'CarouselSlide', fields: ['image'] },
    { model: TeamMember, name: 'TeamMember', fields: ['image'] },
    { model: PhoneShowcase, name: 'PhoneShowcase', fields: ['image'] },
    { model: Settings, name: 'Settings', fields: ['value'] },
  ];
  for (const col of collections) {
    const query = { $or: col.fields.map(field => ({ [field]: new RegExp(old) })) };
    const docs = await col.model.find(query).lean();
    console.log(`${col.name}: ${docs.length} docs contain old Cloudinary domain`);
    docs.slice(0, 5).forEach(doc => console.log(JSON.stringify(doc, null, 2)));
  }
  await mongoose.disconnect();
  process.exit(0);
})();
