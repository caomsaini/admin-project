const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust the path to your User model if necessary

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/Website_and_MobileApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash("Kaso2021", 10);
    console.log("New Hashed Password:", hashedPassword);

    // Create the admin user
    const adminUser = new User({
      name: "kasoadmin",
      email: "online@kasostore.com",
      password: hashedPassword,
      role: "admin",
    });

    // Save the user to the database
    await adminUser.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

createAdmin();
