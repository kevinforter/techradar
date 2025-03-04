const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null)
    return res.status(401).json({ error: 'Access token not provided' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ error: 'Invalid or expired access token' });
    req.user = user;
    next();
  });
};

const authRole = () => {
  if (!process.env.AUTH_ROLE) {
    throw new Error('AUTH_ROLE is not defined in the environment variables.');
  }

  const allowedRoles = process.env.AUTH_ROLE.split('||').map((role) =>
    role.trim(),
  );

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(401);
      return res.send('User not authenticated or missing role');
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(401);
      return res.send('Not allowed');
    }
    next();
  };
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15min',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

const verifyRefreshToken = (res, refreshToken) => {
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({
      username: user.username,
      role: user.role,
    });
    res.json({ accessToken: accessToken });
  });
};

module.exports = {
  authToken,
  authRole,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
