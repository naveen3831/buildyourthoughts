const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

(async () => {
  const res = await cloudinary.api.resources({ type: 'upload', prefix: 'speshway/projects', max_results: 50 });
  console.log('total_count', res.total_count);
  res.resources.forEach(r => console.log(JSON.stringify({ public_id: r.public_id, secure_url: r.secure_url, format: r.format, bytes: r.bytes }, null, 2)));
})();
