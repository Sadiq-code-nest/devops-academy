const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    // Validate all fields present
    if (!name?.trim() || !email?.trim() || !password || !studentId?.trim())
      return res.status(400).json({ message: 'All fields are required' });

    // Validate email format
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format' });

    // Validate password length
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Check duplicates
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists)
      return res.status(409).json({ message: 'Email already registered' });

    const idExists = await User.findOne({ studentId: studentId.trim() });
    if (idExists)
      return res.status(409).json({ message: 'Student ID already in use' });

    await User.create({ name: name.trim(), email, password, studentId: studentId.trim() });

    res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password)
      return res.status(400).json({ message: 'All fields are required' });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format' });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generic message — do not reveal whether email exists
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        studentId: user.studentId,
        role:      user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
