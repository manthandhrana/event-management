const User = require('../models/userModel');
const express = require("express")
const app = express()
app.use(express.json())

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, age, hobbies } = req.body;
    const newUser = new User({ 
      username:req.body.username,
      age:req.body.age
    });
    await newUser.save();
    return res.status(201).json({ message: 'Events Created Successfully' });
    getUsers();
  } catch (error) {
    res.status(500).json({ message: `${error}:Server Error` });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, age, hobbies } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    user.hobbies = hobbies || user.hobbies;
    user.age = age || user.age;

    await user.save();
    res.status(200).json({ message: 'User Update Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(204).json({ message: 'User Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
