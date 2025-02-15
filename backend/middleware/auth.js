const jwt = require('jsonwebtoken');
require('dotenv').config();

let authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

let authRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send('not allowed');
    }
    next();
  };
};

let generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15min',
  });
};

let generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

let verifyRefreshToken = (res, refreshToken) => {
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
