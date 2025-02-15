const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./config/database');
const statusRoute = require('./routes/status.route');

// Connect to MongoDB
db.connect(app, `${process.env.PORT}`);

// Status route
app.use('/api/v1/status', statusRoute);
