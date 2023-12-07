const express = require('express');
const path = require('path');
const { PORT,MONGODB_URI } = require('./config');
const mongoose = require('mongoose');
const redis= require('redis');

const app = express();
// Configure Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./app/routes")(app);

app.get("/", (req, res) => {
    res.send('Welcome to the app');
});

// Catch unknown routes
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// Connect to the MongoDB database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for database connection errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Start listening on port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 