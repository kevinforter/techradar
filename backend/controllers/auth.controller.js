const mongoose = require('mongoose');
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

module.exports = {
  register,
};
