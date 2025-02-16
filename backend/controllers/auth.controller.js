const user = require('../models/user.model');
const token = require('../models/refreshToken.model');
const audit = require('../models/auditLogins.model');
const {
  authToken,
  authRole,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../middleware/auth');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const userToPersist = req.body;
    const existingUser = await user.findOne({
      username: userToPersist.username,
      email: userToPersist.email,
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    userToPersist.password = await bcrypt.hash(userToPersist.password, salt);

    const userDoc = await user.create(userToPersist);
    res.status(200).json({
      message: 'Registration was successfully',
      data: userDoc,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const loginUser = req.body;
    const existingUser = await user.findOne({ username: loginUser.username });

    if (!existingUser) return res.status(404).json({ error: 'User not found' });
    if (!(await bcrypt.compare(loginUser.password, existingUser.password)))
      return res.status(401).json({ error: 'Wrong Password' });

    const userObj = {
      username: existingUser.username,
      role: existingUser.role,
    };

    if (existingUser.role === 'CTO' || existingUser.role === 'Tech-Lead') {
      await audit.create({ user: existingUser._id });
    }

    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);

    const refreshTokenDoc = await token.findOneAndUpdate(
      { user: existingUser._id },
      { token: refreshToken },
      { new: true, upsert: true },
    );
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshTokenDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await token.deleteOne({ token: refreshToken });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
};
