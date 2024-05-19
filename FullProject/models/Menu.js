const mongoose = require("mongoose");
let menuSchema = mongoose.Schema({
  title: String,
  price: String,
  description: String,
  image: Buffer
}
);
let Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
