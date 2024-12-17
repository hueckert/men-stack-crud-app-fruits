
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); 
const morgan = require("morgan"); 

mongoose.connect(process.env.MONGODB_URI);
const app = express();

// This is what populates req.body in our POST routes
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Fruit = require("./models/fruit.js");

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  res.render("fruits/index.ejs", { fruits: allFruits });
});


// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});
// PUT /fruits/:fruitId
app.put("/fruits/:fruitId", async (req, res) => {
  console.log('request body before transformation', req.body)
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  console.log('request body after transformation', req.body)
  
  // Update the fruit in the database (Mongo Query)
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
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

app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
  
});

app.get("/fruits/:fruitId/edit", async (req, res) => {
  // Mongo Query (findById returns one record)
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", { fruit: foundFruit });
});



app.listen(3030, () => {
  console.log('Listening on port 3030');
});
