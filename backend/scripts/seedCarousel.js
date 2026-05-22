/**
 * Seeds 15 professional carousel slides with related images on Cloudinary.
 * Run (backend must be on port 5000): npm run seed:carousel
 */

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const API = process.env.API_URL || "http://localhost:5000/api";
const TOTAL = 15;

// Hero image params — wide cinematic crop, high quality
const IMG = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&h=1080&q=90`;

// Professional slides — each image chosen to match the service topic
const slides = [
  {
    badge: "Mobile App Development",
    title: "Stunning Mobile Apps",
    highlight: "For Every Platform",
    desc: "We craft high-performance iOS and Android apps users love — from UX design to App Store launch.",
    ctaText: "View Projects",
    ctaLink: "/projects",
    cta2Text: "Get a Quote",
    cta2Link: "/contact",
    order: 0,
    imageUrl: IMG("photo-1607252650355-f7fd0460ccdb"),
    imageId: "byt-carousel-01-mobile-apps",
  },
  {
    badge: "Web Development",
    title: "Build Your Digital Future",
    highlight: "BUILD YOUR THOUGHTS",
    desc: "Full-stack web applications with React, Node.js, and modern frameworks that scale with your business.",
    ctaText: "Our Services",
    ctaLink: "/services",
    cta2Text: "Get in Touch",
    cta2Link: "/contact",
    order: 1,
    imageUrl: IMG("photo-1498050108023-c5249f4df085"),
    imageId: "byt-carousel-02-web-dev",
  },
  {
    badge: "Digital Marketing",
    title: "Grow Your Brand",
    highlight: "Online & Beyond",
    desc: "Data-driven SEO, SEM, social media, and content strategies that turn visitors into loyal customers.",
    ctaText: "Learn More",
    ctaLink: "/services",
    cta2Text: "Contact Us",
    cta2Link: "/contact",
    order: 2,
    imageUrl: IMG("photo-1551288049-bebda4e38f71"),
    imageId: "byt-carousel-03-digital-marketing",
  },
  {
    badge: "Mobile App Development",
    title: "iOS & Android Apps",
    highlight: "That Users Love",
    desc: "From fintech to healthcare, we deliver cross-platform mobile solutions with React Native and Flutter.",
    ctaText: "View Projects",
    ctaLink: "/projects",
    cta2Text: "Start Project",
    cta2Link: "/contact",
    order: 3,
    imageUrl: IMG("photo-1512941937669-90a1b58e7e9c"),
    imageId: "byt-carousel-04-mobile-ios-android",
  },
  {
    badge: "Web Development",
    title: "Enterprise Web Solutions",
    highlight: "Built to Scale",
    desc: "Secure, fast web platforms for startups and enterprises — APIs, dashboards, and portals done right.",
    ctaText: "Our Work",
    ctaLink: "/projects",
    cta2Text: "Talk to Us",
    cta2Link: "/contact",
    order: 4,
    imageUrl: IMG("photo-1522071820081-009f0129c71c"),
    imageId: "byt-carousel-05-enterprise-web",
  },
  {
    badge: "Digital Marketing",
    title: "SEO & Social Media",
    highlight: "That Drives Results",
    desc: "Rank higher and reach more. Campaigns engineered for measurable ROI across search and social channels.",
    ctaText: "Get Started",
    ctaLink: "/contact",
    cta2Text: "Our Services",
    cta2Link: "/services",
    order: 5,
    imageUrl: IMG("photo-1611162616475-46b635cb6868"),
    imageId: "byt-carousel-06-seo-social",
  },
  {
    badge: "UI/UX Design",
    title: "Interfaces That Convert",
    highlight: "Beautiful & Functional",
    desc: "Research-led UI/UX for web and mobile — wireframes, prototypes, and pixel-perfect product design.",
    ctaText: "See Portfolio",
    ctaLink: "/projects",
    cta2Text: "Get a Quote",
    cta2Link: "/contact",
    order: 6,
    imageUrl: IMG("photo-1561070791-2526d30994b5"),
    imageId: "byt-carousel-07-ui-ux",
  },
  {
    badge: "Cloud & DevOps",
    title: "Cloud-Native Applications",
    highlight: "Always Available",
    desc: "Scalable cloud architecture, microservices, and CI/CD pipelines that keep your business running 24/7.",
    ctaText: "Cloud Services",
    ctaLink: "/services",
    cta2Text: "Contact Us",
    cta2Link: "/contact",
    order: 7,
    imageUrl: IMG("photo-1451187580459-43490279c0fa"),
    imageId: "byt-carousel-08-cloud-devops",
  },
  {
    badge: "Digital Marketing",
    title: "Content That Connects",
    highlight: "With Your Audience",
    desc: "Strategic storytelling, email campaigns, and brand content that builds trust and drives engagement.",
    ctaText: "Learn More",
    ctaLink: "/services",
    cta2Text: "Get in Touch",
    cta2Link: "/contact",
    order: 8,
    imageUrl: IMG("photo-1600880292089-90a7e086ee0c"),
    imageId: "byt-carousel-09-content-marketing",
  },
  {
    badge: "Full-Stack Solutions",
    title: "End-to-End IT Solutions",
    highlight: "From Idea to Launch",
    desc: "Strategy, design, development, and marketing — everything you need to win in the digital economy.",
    ctaText: "Start Today",
    ctaLink: "/contact",
    cta2Text: "View Services",
    cta2Link: "/services",
    order: 9,
    imageUrl: IMG("photo-1531482615713-2afd69097998"),
    imageId: "byt-carousel-10-fullstack",
  },
  {
    badge: "Cybersecurity",
    title: "Secure By Design",
    highlight: "Protect Your Business",
    desc: "Penetration testing, compliance-ready security, and hardened infrastructure for peace of mind.",
    ctaText: "Security Services",
    ctaLink: "/services",
    cta2Text: "Contact Us",
    cta2Link: "/contact",
    order: 10,
    imageUrl: IMG("photo-1550751827-4bd374c3f58b"),
    imageId: "byt-carousel-11-cybersecurity",
  },
  {
    badge: "AI & Automation",
    title: "Intelligent Software",
    highlight: "Work Smarter",
    desc: "Custom AI integrations, workflow automation, and smart analytics that reduce cost and boost output.",
    ctaText: "Explore AI",
    ctaLink: "/services",
    cta2Text: "Talk to Experts",
    cta2Link: "/contact",
    order: 11,
    imageUrl: IMG("photo-1620712943543-bcc4688e7485"),
    imageId: "byt-carousel-12-ai-automation",
  },
  {
    badge: "E-Commerce",
    title: "Online Stores That Sell",
    highlight: "Shopify & Custom",
    desc: "High-converting e-commerce platforms with secure payments, inventory sync, and mobile-first checkout.",
    ctaText: "View Projects",
    ctaLink: "/projects",
    cta2Text: "Get a Quote",
    cta2Link: "/contact",
    order: 12,
    imageUrl: IMG("photo-1556742049-0cfed4f6a45d"),
    imageId: "byt-carousel-13-ecommerce",
  },
  {
    badge: "DevOps & Agile",
    title: "Ship Faster",
    highlight: "With Confidence",
    desc: "Agile delivery, automated testing, and DevOps practices that shorten release cycles without sacrificing quality.",
    ctaText: "Our Process",
    ctaLink: "/about",
    cta2Text: "Contact Us",
    cta2Link: "/contact",
    order: 13,
    imageUrl: IMG("photo-1553877522-43269d4ea984"),
    imageId: "byt-carousel-14-devops-agile",
  },
  {
    badge: "IT Consulting",
    title: "Your Technology Partner",
    highlight: "Trusted Worldwide",
    desc: "Technology roadmaps, digital transformation, and dedicated teams aligned with your business goals.",
    ctaText: "Partner With Us",
    ctaLink: "/contact",
    cta2Text: "About Us",
    cta2Link: "/about",
    order: 14,
    imageUrl: IMG("photo-1600880292203-757bb62b4baf"),
    imageId: "byt-carousel-15-it-consulting",
  },
];

async function getToken() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  const data = await res.json();
  if (!data.token) throw new Error(`Login failed: ${data.message || res.status}`);
  return data.token;
}

async function uploadToCloudinary(imageUrl, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      {
        folder: "speshway/carousel",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 1920, height: 1080, crop: "fill", gravity: "auto", quality: "auto:best" },
          { effect: "improve" },
          { effect: "brightness:-8" },
          { effect: "contrast:10" },
        ],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });
}

async function run() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    throw new Error("Missing CLOUDINARY_* vars in backend/.env");
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("Missing ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env");
  }

  console.log("🔐 Authenticating...");
  const token = await getToken();
  console.log("✅ Authenticated\n");

  console.log("🗑️  Clearing existing carousel slides...");
  const existing = await fetch(`${API}/carousel/all`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
  const list = Array.isArray(existing) ? existing : [];
  for (const slide of list) {
    await fetch(`${API}/carousel/${slide._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  console.log(`   Removed ${list.length} old slide(s)\n`);

  console.log(`🚀 Creating ${TOTAL} carousel slides on Cloudinary...\n`);

  let ok = 0;
  for (const slide of slides) {
    try {
      process.stdout.write(`⬆️  [${slide.order + 1}/${TOTAL}] ${slide.badge} — uploading... `);

      const uploaded = await uploadToCloudinary(slide.imageUrl, slide.imageId);
      console.log("✅");

      const res = await fetch(`${API}/carousel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          badge: slide.badge,
          title: slide.title,
          highlight: slide.highlight,
          desc: slide.desc,
          ctaText: slide.ctaText,
          ctaLink: slide.ctaLink,
          cta2Text: slide.cta2Text,
          cta2Link: slide.cta2Link,
          order: slide.order,
          image: uploaded.secure_url,
          imagePublicId: uploaded.public_id,
          isActive: true,
        }),
      });

      if (res.ok) {
        ok++;
        console.log(`   💾 "${slide.title} ${slide.highlight}"`);
        console.log(`   🔗 ${uploaded.secure_url}\n`);
      } else {
        const err = await res.json();
        console.log(`   ⚠️  API error: ${err.message}\n`);
      }
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}\n`);
    }
  }

  console.log(`\n🎉 Done! ${ok}/${TOTAL} slides saved with Cloudinary images.`);
  console.log("📋 Edit at: /admin/carousel");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
