const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const multer = require('multer');
const path = require('path');
const cors = require('cors');

const productRoute = require('./controllers/productControllers');
const userRoute = require('./controllers/userController');

const app = express();
const port = process.env.PORT || 5000;

// Database connection configuration
const username = 'Kidds';
const encodedPassword = encodeURIComponent('Q60iTCIhePWHfWRT');
const connectionString = `mongodb+srv://${username}:${encodedPassword}@cluster0.bksr0p1.mongodb.net/Products`;

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Initialize MongoStore with session
const sessionStore = MongoStore.create({ mongoUrl: connectionString });

// Session configuration with MongoStore
app.use(session({
  secret: '@34rdghg7zeghl/iyl7t6tf', // Replace with a secure random string
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Session expires after 24 hours
}));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route mounting with prefix
app.use('/api', productRoute);
app.use('/auth', userRoute);

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
