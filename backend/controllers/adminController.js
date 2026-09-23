const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate fields present
    if (!username?.trim() || !password)
      return res.status(400).json({ message: 'All fields are required' });

    // Compare against .env — constant time to prevent timing attacks
    const validUser = username === process.env.ADMIN_USERNAME;
    const validPass = password === process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { name: 'Administrator', role: 'admin' },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/students
exports.getStudents = async (_req, res) => {
  try {
    const students = await User
      .find({ role: 'student' })
      .select('name email studentId createdAt')
      .sort({ createdAt: -1 });

    res.json({ total: students.length, students });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
