const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../models/userModel");

/**
 * User Registration Controller
 */
exports.signup = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    const { firstName, lastName, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create user object
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Insert user into MongoDB
    const result = await usersCollection.insertOne(newUser);
    if (!result.insertedId) {
      return res.status(500).json({ message: "Error creating user" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with token and user data (excluding password)
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertedId,
        firstName,
        lastName,
        email,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
