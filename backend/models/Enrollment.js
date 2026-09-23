const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, lowercase: true },
  phone:      { type: String, default: '' },
  background: { type: String, default: '' },
  status:     { type: String, enum: ['pending', 'contacted', 'enrolled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollSchema);
