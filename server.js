const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const userRoutes = require('./src/routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Configuration
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: process.env.STEAM_API_KEY
}, function(identifier, profile, done) {
  // User.findOrCreate({ openid: identifier }, function(err, user) {
  //   return done(err, user);
  // });
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to TradeIt Clone!');
});

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  // Start Server
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});