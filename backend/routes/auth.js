const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require("nodemailer");


const JWT_SECRET = 'your_secret_key';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();
  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});

// Step 1: Send OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  user.resetOTP = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  // Send email with OTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sachauhan008@gmail.com",
      pass: "skbnacvxgaisagno",
    },
  });

  await transporter.sendMail({
    from: "sachauhan008@gmail.com",
    to: email,
    subject: "Reset Password OTP",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });

  res.json({ message: "OTP sent to email" });
});

// Step 2: Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOTP != otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Password updated successfully" });
});


// Step 1: Send OTP after entering name/email/password
router.post("/send-otp", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword, resetOTP: otp, otpExpires: Date.now() + 10 * 60 * 1000 });
  await user.save();

  // Send OTP email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sachauhan008@gmail.com",
      pass: "skbnacvxgaisagno",
    },
  });

  await transporter.sendMail({
    from: "sachauhan008@gmail.com",
    to: email,
    subject: "Verify Your Account",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  res.json({ message: "OTP sent" });
});

// Step 2: Verify OTP and activate account
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOTP != otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.resetOTP = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Account verified successfully" });
});

module.exports = router;