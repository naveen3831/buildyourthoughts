const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const { cloudinary } = require("../config/cloudinary");
const nodemailer = require("nodemailer");
const multer = require("multer");

// Memory storage for resume
const resumeMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    cb(null, allowed.includes(file.mimetype));
  },
});
exports.resumeUpload = resumeMemory;

const sendApplicationEmail = async ({ jobTitle, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, resumeBuffer }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email not configured — set EMAIL_USER and EMAIL_PASS in .env");
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const attachments = [];
  if (resumeBuffer && resumeOriginalName) {
    attachments.push({ filename: resumeOriginalName, content: resumeBuffer });
  }
  await transporter.sendMail({
    from: `"Speshway Careers" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Job Application: ${jobTitle} — ${name}`,
    html: `
      <div style="font-family:'Times New Roman',serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0b78d2;border-bottom:2px solid #0b78d2;padding-bottom:8px">New Job Application</h2>
        <table style="border-collapse:collapse;width:100%;margin-top:16px">
          <tr style="background:#f9f9f9"><td style="padding:10px 14px;font-weight:bold;width:140px">Position</td><td style="padding:10px 14px">${jobTitle}</td></tr>
          <tr><td style="padding:10px 14px;font-weight:bold">Applicant</td><td style="padding:10px 14px">${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:10px 14px;font-weight:bold">Email</td><td style="padding:10px 14px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:10px 14px;font-weight:bold">Phone</td><td style="padding:10px 14px">${phone || "—"}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:10px 14px;font-weight:bold">Cover Letter</td><td style="padding:10px 14px">${coverLetter || "—"}</td></tr>
          ${resumeUrl ? `<tr><td style="padding:10px 14px;font-weight:bold">Resume Link</td><td style="padding:10px 14px"><a href="${resumeUrl}" style="color:#0b78d2">View / Download Resume</a></td></tr>` : ""}
        </table>
        <p style="color:#888;font-size:12px;margin-top:24px">This application was submitted via the BUILD YOUR THOUGHTS careers page.</p>
      </div>
    `,
    attachments,
  });
};

exports.getPublic = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" }).sort({ order: 1, createdAt: -1 }).lean();
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ order: 1, createdAt: -1 });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndUpdate(
      req.params.appId,
      { status: req.body.status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Not found" });
    res.json(app);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, location, type, salary, department, experience, desc, requirements, status, order } = req.body;
    const job = await Job.create({
      title, location, type, salary, department, experience, desc,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split("\n").map(r => r.trim()).filter(Boolean) : []),
      status: status || "Open",
      order: order || 0,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, location, type, salary, department, experience, desc, requirements, status, order } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title, location, type, salary, department, experience, desc,
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split("\n").map(r => r.trim()).filter(Boolean) : []),
        status: status || "Open",
        order: order || 0,
      },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.apply = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const { name, email, phone, coverLetter } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
    let resumeUrl = "", resumePublicId = "", resumeOriginalName = "", resumeBuffer = null;
    if (req.file) {
      resumeOriginalName = req.file.originalname;
      resumeBuffer = req.file.buffer;
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "speshway/resumes", resource_type: "raw", public_id: `${Date.now()}_${resumeOriginalName}` },
          (err, result) => err ? reject(err) : resolve(result)
        );
        stream.end(resumeBuffer);
      });
      resumeUrl = uploadResult.secure_url;
      resumePublicId = uploadResult.public_id;
    }
    const application = await JobApplication.create({
      jobId: job._id, jobTitle: job.title,
      name, email, phone: phone || "", coverLetter: coverLetter || "",
      resumeUrl, resumePublicId, resumeOriginalName,
    });
    sendApplicationEmail({ jobTitle: job.title, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, resumeBuffer })
      .then(() => console.log(`✅ Email sent for application: ${name} - ${job.title}`))
      .catch(err => console.error("❌ Email error:", err.message));
    res.status(201).json({ message: "Application submitted successfully", id: application._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find({ jobId: req.params.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
