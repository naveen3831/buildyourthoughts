const Contact = require("../models/Contact");

exports.getStats = async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ status: "unread" });
    res.json({
      projects: { total: 50, active: 12, completed: 38 },
      clients: { total: 30, new: 4 },
      revenue: { monthly: "₹4.2L", growth: "+12%" },
      team: { total: 15, departments: 4 },
      messages: { total: totalMessages, unread: unreadMessages },
      uptime: "99.9%",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5).lean();
    const activity = recentContacts.map(c => ({
      id: c._id,
      type: "message",
      message: `Contact form: "${c.subject}" from ${c.name}`,
      time: new Date(c.createdAt).toLocaleString(),
      color: c.status === "unread" ? "accent" : "secondary",
    }));
    if (activity.length === 0) {
      activity.push(
        { id: 1, type: "project", message: "E-Commerce Platform delivered", time: "2 days ago", color: "primary" },
        { id: 2, type: "client", message: "New client onboarded: HealthCo", time: "3 days ago", color: "secondary" }
      );
    }
    res.json(activity);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProjects = (req, res) => {
  res.json([
    { id: 1, name: "E-Commerce Platform", client: "RetailCo", status: "Completed", tech: "React, Node.js", date: "Mar 2026" },
    { id: 2, name: "HealthCare App", client: "HealthCo", status: "Active", tech: "React Native, Firebase", date: "Apr 2026" },
    { id: 3, name: "Food Delivery App", client: "FoodHub", status: "Completed", tech: "Flutter, Node.js", date: "Feb 2026" },
    { id: 4, name: "Fitness Tracker", client: "FitLife", status: "Active", tech: "React Native, Python", date: "Apr 2026" },
    { id: 5, name: "FinTech Dashboard", client: "FinEdge", status: "In Progress", tech: "React, Django", date: "May 2026" },
    { id: 6, name: "Social Network", client: "VibeApp", status: "In Progress", tech: "React Native, GraphQL", date: "May 2026" },
  ]);
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: "after" });
    res.json(msg);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

