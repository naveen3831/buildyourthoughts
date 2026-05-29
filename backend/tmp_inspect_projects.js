const path = require('path');
const dns = require('dns');

dns.setServers(['8.8.8.8','8.8.4.4','1.1.1.1']);
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const mongoose = require('mongoose');
const Project = require('./src/models/Project');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts', serverSelectionTimeoutMS: 10000 });
  const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  console.log('count', docs.length);
  docs.forEach(doc => console.log(JSON.stringify({ _id: doc._id, title: doc.title, image: doc.image, imagePublicId: doc.imagePublicId, status: doc.status, createdAt: doc.createdAt }, null, 2)));
  await mongoose.disconnect();
  process.exit(0);
})();

})();
