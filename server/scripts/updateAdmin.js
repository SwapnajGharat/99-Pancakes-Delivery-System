import { User } from '../models/User.js';

const ADMIN_EMAIL = 'swapnaj@gmail.com';
const ADMIN_PASSWORD = '1234567890';

const updateAdmin = async () => {
  try {
    let adminUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
    if (!adminUser) adminUser = await User.findOne({ role: 'admin' }).select('+password');

    if (adminUser) {
      adminUser.email = ADMIN_EMAIL;
      adminUser.password = await User.hashPassword(ADMIN_PASSWORD);
      adminUser.role = 'admin';
      adminUser.name ||= '99 Pancakes Admin';
      await adminUser.save();
    } else {
      await User.create({
        name: '99 Pancakes Admin',
        email: ADMIN_EMAIL,
        phone: '9876543210',
        password: ADMIN_PASSWORD,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      });
    }
    console.log(`[UpdateAdmin] Admin ready: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('[UpdateAdmin Error] Failed to update admin user:', error);
    process.exitCode = 1;
  }
};

updateAdmin();
