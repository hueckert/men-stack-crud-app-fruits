// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

const express = require('express');
const mongoose = require("mongoose"); // require package

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

  // Import the Fruit model
const Fruit = require("./models/fruit.js");

app.use(express.urlencoded({ extended: false }));


// GET /
app.get("/", async (req, res) => {
    //res.send("hello, friend!");
    res.render("index.ejs");
  });
  
  // GET /fruits/new
app.get("/fruits/new", (req, res) => {
    //res.send("This route sends the user a form page!");
    res.render("fruits/new.ejs");
  });

// POST /fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect("/fruits/new");
  });


app.listen(3000, () => {
  console.log('Listening on port 3000');
});


