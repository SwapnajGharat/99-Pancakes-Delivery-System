import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const ADMIN_EMAIL = 'swapnaj@gmail.com';
const ADMIN_PASSWORD = '1234567890';
const ADMIN_ROLE = 'admin';

const updateAdmin = async () => {
  try {
    console.log('[UpdateAdmin] Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('[UpdateAdmin] Connected to MongoDB.');

    // 1. Check if user with target admin email already exists
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });

    if (adminUser) {
      console.log(`[UpdateAdmin] Found existing user with email ${ADMIN_EMAIL}. Updating password and role to admin...`);
      adminUser.role = ADMIN_ROLE;
      adminUser.password = ADMIN_PASSWORD; // Will trigger User.js pre('save') bcrypt hashing mechanism
      if (!adminUser.name) adminUser.name = '99 Pancakes Admin';
      await adminUser.save();
      console.log(`[UpdateAdmin] Successfully updated user ${ADMIN_EMAIL} with role '${ADMIN_ROLE}'.`);
    } else {
      // 2. Check if any admin user exists under an old/different email
      adminUser = await User.findOne({ role: ADMIN_ROLE });

      if (adminUser) {
        console.log(`[UpdateAdmin] Found existing admin user (${adminUser.email}). Updating email to ${ADMIN_EMAIL} and setting new password...`);
        adminUser.email = ADMIN_EMAIL;
        adminUser.password = ADMIN_PASSWORD; // Will trigger User.js pre('save') bcrypt hashing mechanism
        adminUser.role = ADMIN_ROLE;
        await adminUser.save();
        console.log(`[UpdateAdmin] Successfully updated admin account email to ${ADMIN_EMAIL}.`);
      } else {
        // 3. No admin user found at all; create new admin
        console.log(`[UpdateAdmin] No existing admin user found. Creating new admin user ${ADMIN_EMAIL}...`);
        adminUser = await User.create({
          name: '99 Pancakes Admin',
          email: ADMIN_EMAIL,
          phone: '9876543210',
          password: ADMIN_PASSWORD,
          role: ADMIN_ROLE,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        });
        console.log(`[UpdateAdmin] Successfully created new admin account ${ADMIN_EMAIL}.`);
      }
    }

    console.log('==================================================');
    console.log('✅ ADMIN ACCOUNT UPDATED SAFELY!');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role    : ${ADMIN_ROLE}`);
    console.log('   No existing customer data, products, orders, categories, or reviews were deleted.');
    console.log('==================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[UpdateAdmin Error] Failed to update admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateAdmin();
