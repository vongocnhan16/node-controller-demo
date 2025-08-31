const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ user_id: user.user_id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await User.verifyPassword(user, password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ user_id: user.user_id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ user: { user_id: user.user_id, username: user.username, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, signin };
