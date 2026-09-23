const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String, required: true, unique: true, lowercase: true,
    validate: {
      validator: v => emailRegex.test(v),
      message:   'Invalid email format',
    },
  },
  password: {
    type: String, required: true,
    minlength: [6, 'Password must be at least 6 characters'],
  },
  studentId: {
    type: String, required: true, unique: true, trim: true,
    minlength: [3, 'Student ID too short'],
  },
  role: { type: String, enum: ['student'], default: 'student' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
