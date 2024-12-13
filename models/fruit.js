// models/fruit.js

const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
    price: mongoose.Decimal128,
  });

  const Fruit = mongoose.model("Fruit", fruitSchema); // create model


module.exports = Fruit;
