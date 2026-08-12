const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const adminEmails = process.env.ADMIN_EMAILS.split(',');
const role = adminEmails.includes(req.body.email) ? 'admin' : 'user';
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token, role: user.role });  } catch (err) {
    res.status(500).json({ error: err.message });
    }
  }

    

module.exports = { registerUser, loginUser, };