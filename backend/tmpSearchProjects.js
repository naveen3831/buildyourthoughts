const path = require('path');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const mongoose = require('mongoose');
const Project = require('./src/models/Project');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts', serverSelectionTimeoutMS: 10000 });
  const query = {
    $or: [
      { title: { $regex: 'check', $options: 'i' } },
      { category: { $regex: 'check', $options: 'i' } },
      { description: { $regex: 'check', $options: 'i' } },
      { client: { $regex: 'check', $options: 'i' } },
    ],
  };
  const docs = await Project.find(query).lean();
  console.log('matches', docs.length);
  docs.forEach(d => console.log(JSON.stringify({ _id: d._id, title: d.title, category: d.category, description: d.description, client: d.client, image: d.image }, null, 2)));
  await mongoose.disconnect();
  process.exit(0);
})();
