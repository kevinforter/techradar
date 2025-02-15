const getStatus = (req, res) => {
  const status = {
    Status: 'Running',
  };
  res.send(status);
};

module.exports = { getStatus };
