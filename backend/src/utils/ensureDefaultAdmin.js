const User = require('../models/User');

const defaultPermissions = [
  'manage_students',
  'manage_teachers',
  'manage_courses',
  'manage_fees',
  'manage_attendance',
  'manage_tests',
  'manage_study_material',
  'view_analytics',
  'send_notifications',
  'manage_roles',
];

const ensureDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) return;

  await User.create({
    name: 'Math Point Admin',
    email,
    phone: '9999999999',
    password,
    role: 'superadmin',
    permissions: defaultPermissions,
  });

  console.log(`Default admin created for ${email}`);
};

module.exports = ensureDefaultAdmin;
