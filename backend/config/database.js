const mongoose = require('mongoose');

const connect = (app, port) => {
  mongoose
    .connect(
      `${process.env.ME_CONFIG_MONGODB_URL}${process.env.MONGO_INITDB_DATABASE}?authSource=admin`,
    )
    .then(() => {
      console.log('Connected to Database');
      console.log(
        `${process.env.ME_CONFIG_MONGODB_URL}${process.env.MONGO_INITDB_DATABASE}`,
      );

      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    })
    .catch(() => {
      console.error('Not able to conn to MongoDB!');
    });
};

module.exports = { connect };
