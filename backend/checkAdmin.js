require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');

(async () => {
  try {
    console.log('connecting');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'buildyourthoughts', family: 4, serverSelectionTimeoutMS: 10000 });
    console.log('connected');
    const admins = await Admin.find({}, 'email role isActive').lean();
    console.log('admins:', admins);
    const admin = await Admin.findOne({ email: 'srikanthsiddani97@gmail.com' });
    console.log('srikanth exists:', !!admin, admin ? admin.email : 'none');
    await mongoose.disconnect();
  } catch (err) {
    console.error('err', err);
    process.exit(1);
  }
})();
