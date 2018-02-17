var
express               = require("express"),
mongoose              = require("mongoose"),
User                  = require("./models/user"),
passport              = require("passport"),
localStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
bodyParser            = require("body-parser");

mongoose.connect('mongodb://localhost/ath_app');

var app = express();

//Set default view engine
app.set('view engine', 'ejs');

//Using body body parser
app.use(bodyParser.urlencoded({extended: true}));

// TODO: Find information about how seesion and passport works if colt doesn explain at the endo of the course
// Require session using special parameters to encode/decode information send by passportLocalMongoose
app.use(require("express-session")({
  secret: "Se supone que esto se usa para codificar algo",
  resave: false,
  saveUninitialized: false
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//======================
//     ROUTES
//======================

app.get("/", function(req, res){
  res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
  res.render("secret");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });
  });
});

app.get("/login", function(req, res){
  res.render("login");
});
//Using passport.authenticate as middleware instead in the callback function
app.post("/login", passport.authenticate("local",{
  successRedirect: "/secret",
  failureRedirect: "/login",
}),function(req, res){
});

app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function(){
  console.log("Server listening at http://localhost:3000");
});
