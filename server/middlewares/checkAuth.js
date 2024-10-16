const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    } else {
      req.user = decoded;
      next();
    }
  });
};

module.exports = checkAuth;
