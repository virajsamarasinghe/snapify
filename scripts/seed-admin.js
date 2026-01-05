const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// We will run this with `npx dotenv -e .env -- node scripts/seed-admin.js`
// so process.env.DATABASE_URL will be available.

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error('Error: DATABASE_URL is not defined.');
  process.exit(1);
}

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Define Schema (matching models/User.ts)
    const UserSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "admin" },
      },
      { timestamps: true }
    );

    // Get Model
    // Note: Mongoose defaults to lowercase plural 'users' collection.
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const email = 'admin@snapify.com';
    const password = 'password123';

    // Check if exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Admin user already exists: ${email}`);
      console.log('Password is unchanged (if you forgot it, delete the user from DB and re-run).');
      return;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    await User.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('------------------------------------------------');
    console.log('Admin User Created Successfully!');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
