var express         = require("express"), 
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override")

var authRoutes      = require("./routes/auths"),
    commentRoutes   = require("./routes/comments"),
    campRoutes      = require("./routes/campgrounds"),
    userRoutes      = require("./routes/user"),
    js_code         = require("./public/js/app")

var result = require('dotenv').config()

if (result.error) {
  throw result.error
}

//console.log(process.env.CLOUDINARY_API_KEY)

app.use(flash())

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v10"
mongoose.connect(url);
//mongoose.connect("mongodb://higorfelype:hf4036@ds249035.mlab.com:49035/yelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
//Seeds()


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// This function is used to not need to send a 'user' through all the other functions for the templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user // This is the 'user' that would be sent
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.moment = require("moment")
    next()
})

app.get("/", function(req, res){
    res.render("landing");
})

app.use("/campgrounds", campRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/", authRoutes)
app.use("/user", userRoutes)

app.listen(process.env.PORT, process.env.ID, function(){
    console.log("The YelpCamp Server has started!")
})