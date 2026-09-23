require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const connectDB = require('./config/db');

(async () => {
  await connectDB();

  const exists = await User.findOne({ email: 'admin@devopsacademy.com' });
  if (exists) {
    console.log('⚠️  Admin already exists — skipping.');
    process.exit(0);
  }

  await User.create({
    name:     'Admin',
    email:    'admin@devopsacademy.com',
    password: 'Admin@1234',       // hashed automatically by pre-save hook
    role:     'admin',
  });

  console.log('✅ Admin user created');
  console.log('   Email:    admin@devopsacademy.com');
  console.log('   Password: Admin@1234');
  console.log('   ⚠️  Change this password after first login.');
  process.exit(0);
})();
