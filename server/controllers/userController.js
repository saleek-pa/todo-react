const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const imagePath = req.file ? req.file.filename : null;

  await User.create({ name, email, password: hashedPassword, image: imagePath });

  res.status(201).json({
    status: 'success',
    message: 'Registration successful',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ status: 'failure', message: 'Email not found. Please register.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ status: 'failure', message: 'Incorrect Password. Try again.' });
  }

  const token = jwt.sign({ email, userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return res.status(200).json({
    status: 'success',
    message: 'Login successfull',
    data: token,
  });
};

const getAllUsers = async (req, res) => {
  const { userId } = req.user;
  const users = await User.find({ _id: { $ne: userId } }, 'name email image');

  return res.status(200).json({
    status: 'success',
    message: 'Users retrieved successfully',
    data: users,
  });
};

const getUserProfile = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId, 'name email image');

  return res.status(200).json({
    status: 'success',
    message: 'User details retrieved successfully',
    data: user,
  });
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  let image = req.file ? req.file.filename : null;

  const existingUser = await User.findOne({ email, _id: { $ne: userId } });
  if (existingUser) {
    return res.status(400).json({
      status: 'failure',
      message: 'Email already exists.',
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email, ...(image && { image }) },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      status: 'failure',
      message: 'User not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: updatedUser,
  });
};

module.exports = { register, login, getAllUsers, getUserProfile, updateUserProfile };
