// Controller logic for user authentication routes

import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// Utility functions for validation
const isValidEmail = (email) =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobile = (mobileNumber) =>
  typeof mobileNumber === 'string' &&
  /^\d{10,15}$/.test(mobileNumber);

const isStrongPassword = (password) => {
  // At least 8 characters, at least one symbol
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[^A-Za-z0-9]/.test(password) // checks for at least one non-alphanumeric character (symbol)
  );
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date);
};

// Signup controller
export const signup = async (req, res) => {
  try {
    let { name, email, password, mobileNumber, dateOfBirth } = req.body;

    // Validate presence
    if (!name || !email || !password || !mobileNumber || !dateOfBirth) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Field validation
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    }

    email = email.toLowerCase().trim();
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (!isValidMobile(mobileNumber)) {
      return res.status(400).json({ message: 'Invalid mobile number.' });
    }

    if (!isValidDate(dateOfBirth)) {
      return res.status(400).json({ message: 'Invalid date of birth.' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      mobileNumber: mobileNumber.trim(),
      dateOfBirth: new Date(dateOfBirth)
    });

    // Do not return password
    const { password: _, ...userData } = user.toObject();

    return res.status(201).json({ message: 'User registered successfully.', user: userData });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed.', error: err.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { password: _, ...userData } = user.toObject();
    return res.status(200).json({ message: 'Login successful.', user: userData });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};