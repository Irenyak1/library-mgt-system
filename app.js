const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");

const expressSession = require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  });
  
require("dotenv").config();

// import models
const Registration = require("./models/Registration");

// set port 
const port = 4200;

// import routes
const indexRoutes = require("./routes/indexRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authorRoutes = require("./routes/authorRoutes")
const bookRoutes = require("./routes/bookRoutes")
const userRoutes = require("./routes/userRoutes")


//instantiate the app
const app = express();

// set db connection to mongoose
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", err => {
    console.error(`Connection error: ${err.message}`);
 });

//set view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cors());

// express session configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

// passport configs
passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());

//Use imported routes
app.use("/", indexRoutes);
app.use("/", adminRoutes);
app.use("/", authorRoutes);
app.use("/", bookRoutes);
app.use("/", userRoutes);


//for invalid routes
app.get("*", (req, res) => {
  res.render("404");
});

// hosting
app.listen(port || process.env.PORT,()=> console.log(`listening on port ${port}`));
