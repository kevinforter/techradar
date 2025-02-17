const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./config/database');
const statusRoute = require('./routes/status.route');
const authRoute = require('./routes/auth.route');
const techRoute = require('./routes/tech.route');

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
db.connect(app, process.env.PORT);

// Status route
app.use('/api/v1/status', statusRoute);

// Auth route
app.use('/api/v1', authRoute);

// Tech route
app.use('/api/v1/tech', techRoute);
