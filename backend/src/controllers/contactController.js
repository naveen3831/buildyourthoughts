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
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const entry = await Contact.create({ name, email, subject, message });

    // Send notification email to srikanth@speshway.com
    await transporter.sendMail({
      from: `"Speshway Contact Form" <${process.env.EMAIL_USER}>`,
      to: "srikanth@speshway.com",
      replyTo: email,
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#888;font-size:12px;">Sent via BUILD YOUR THOUGHTS contact form</p>
      `,
    });

    res.status(201).json({ message: "Message received! We'll get back to you soon.", id: entry._id });
  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
