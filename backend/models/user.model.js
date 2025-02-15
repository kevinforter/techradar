const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username required'],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
    },
    email: {
      type: String,
      required: [true, 'E-Mail required'],
    },
    role: {
      type: String,
      required: false,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

const user = mongoose.model('userCollection', userSchema);
module.exports = user;
