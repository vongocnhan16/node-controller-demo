const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authorize = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header) throw new Error('No token');

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');

    const user = await User.findById(decoded.user_id);
    if (!user) throw new Error('User not found');

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authorize;
