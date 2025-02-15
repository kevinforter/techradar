const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./config/database');

// Connect to MongoDB
db.connect(app, `${process.env.PORT}`);
