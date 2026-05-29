const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.submit = async (req, res) => {
  const { name, email, phone, address, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: "Name, email, subject, and message are required." });

  try {
    const entry = await Contact.create({ name, email, phone: phone || "", address: address || "", subject, message });

    // Respond immediately — don't let email failure block the user
    res.status(201).json({ message: "Message received! We'll get back to you soon.", id: entry._id });

    // Send notification email in the background (non-blocking)
    transporter.sendMail({
      from: `"BUILD YOUR THOUGHTS Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `BUILD YOUR THOUGHTS Contact Form Submission`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Address:</strong> ${address ? address.replace(/\n/g, "<br>") : "—"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#888;font-size:12px;">Sent via BUILD YOUR THOUGHTS contact form</p>
      `,
    }).catch(err => console.error("Contact email send error:", err));

  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );
    if (!contact) return res.status(404).json({ message: "Not found." });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Not found." });
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

