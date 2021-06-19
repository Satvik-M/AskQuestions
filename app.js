const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Question = require("./models/question");
const Answer = require("./models/answers");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { questionSchema, answerSchema } = require("./schemas");
const QuestionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

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

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const msg = error.details.map((e) => e.message).join(",");
      console.log("message = ", msg);
      throw new ExpressError(msg, 400);
    } else next();
  };
};
const validateQuestion = (req, res, next) => {
  const { error } = questionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};
const validateAnswer = (req, res, next) => {
  const { error } = answerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};
app.get("/", (req, res) => {
  //res.send('home');
  res.render("questions/home");
});
//questions routes...
app.use("/questions", QuestionRoutes);
///answer routes
app.use("/questions/:id/answers", answerRoutes);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("inside error handling middleware!!!!!!!\n");
  if (!err.message) err.message = "Something went wrong";
  if (!err.statusCode) err.statusCode = 500;
  //console.log(err.statusCode);
  res.status(err.statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("From port 3000");
});
