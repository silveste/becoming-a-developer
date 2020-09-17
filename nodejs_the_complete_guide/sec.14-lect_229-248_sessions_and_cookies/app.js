const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URL = 'mongodb://localhost/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use((req,res,next) => {
  if (req.session.isLoggedIn) {
    User.findById(req.session.userId)
      .then(user => {
        req.user = user;
        next();
      });
  } else {
    next();
  }
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URL)
  .then(() => app.listen(3000))
  .catch(err => {
    console.log(err);
  });
