//express template 
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

//prepare PORT for heroku deployment
const PORT = process.env.PORT || 3000;

//create express app instance
const app = express();

//body parsers
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//make public folder available for access on client side
app.use(express.static("public"));

//prepare data for heroku deployment and connection
mongoose.connect(process.env.MONGODB_URI ||"mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true 
});

//add routes to app
app.use(require("./routes/api.js"));

//connect listener
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});