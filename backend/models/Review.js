const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  role:           { type: String, default: 'Student' },
  rating:         { type: Number, required: true, min: 1, max: 5 },
  text:           { type: String, required: true },
  transformation: { type: String, default: '' },
  approved:       { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
