const Enrollment = require('../models/Enrollment');

// POST /api/enroll  (public)
exports.submitEnroll = async (req, res) => {
  try {
    const { name, email, phone, background } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: 'Name and email required' });

    const enrollment = await Enrollment.create({ name, email, phone, background });
    res.status(201).json({ message: 'Enrollment received', id: enrollment._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/enroll  (admin only)
exports.getEnrollments = async (_req, res) => {
  try {
    const list = await Enrollment.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
