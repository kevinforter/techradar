const mongoose = require('mongoose');

const getStatus = (req, res) => {
  const state = mongoose.connection.readyState;
  let mongoState;

  if (state === 1) {
    mongoState = 'Connected to MongoDB';
  } else {
    mongoState = 'Not connected to MongoDB';
  }

  const status = {
    Server: 'Running',
    MongoDB: mongoState,
  };
  res.send(status);
};

module.exports = { getStatus };
