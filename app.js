const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Question = require("./models/question");
const Answer = require("./models/answers");
const User = require("./models/users");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { questionSchema, answerSchema } = require("./schemas");
const QuestionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");
const userRoutes = require("./routes/users");
const upvotesRoutes = require("./routes/upvoting");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  validateAnswer,
  validateQuestion,
  isLoggedIn,
} = require("./middleware");

mongoose.connect("mongodb://localhost:27017/project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected!!!");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "...",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 24 * 60 * 60,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.get("/", (req, res) => res.render("home"));
//questions routes...
app.use("/questions", QuestionRoutes);
///answer routes
app.use("/questions/:id/answers", answerRoutes);
//user routes
app.use("/upvote/questions/:id", upvotesRoutes);
app.use("/users", userRoutes);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("inside error handling middleware!!!!!!!\n");
  console.log(err);
  if (!err.message) err.message = "Something went wrong";
  if (!err.statusCode) err.statusCode = 500;
  //console.log(err.statusCode);
  res.status(err.statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("From port 3000");
});
