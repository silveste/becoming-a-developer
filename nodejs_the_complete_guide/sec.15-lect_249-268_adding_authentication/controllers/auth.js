const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup'
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(result => {
          if(result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect('/');
            });
          }
          return res.redirect('/login');
        })
        .catch(e => {
          console.log(e);
          return res.redirect('/login');
        })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email })
    .then(user => {
      req.flash('error', 'E-mail exists already');
      if(user) return res.redirect('/signup')
      return bcrypt
        .hash(password, 12)
        .then(hashsedPwd => {
          const user = new User({
            email,
            password: hashsedPwd,
            cart: { items: [] }
          });
          return user.save();
        });
    })
    .then(() => res.redirect('/login'))
    .catch(e =>  console.log(e));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
