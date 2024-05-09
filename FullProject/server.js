const express = require("express");
const mongoose = require("mongoose");
const Menu = require("./models/Menu");
let server = express();
server.use(express.json());
server.use(express.urlencoded());
server.set("view engine", "ejs");
server.use(express.static("public"));
var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);

let menuApiRouter = require("./routes/api/menu");
server.use("/", menuApiRouter);

server.get("/", (req, res) => {
  res.render("layout", { pageContent: "homepage" });
});

server.get("/contact-us.html", (req, res) => {
  res.render("layout", { pageContent: "contact-us" });
});
server.get("/homepage.html", (req, res) => {
  res.render("layout", { pageContent: "homepage" });
});

server.get("/new.html", (req, res) => {
  res.render("new",{layout: false});
});
server.get("/menu/:page?", async (req, res) => {
  try {
    const page = req.params.page || 1; 
    const pageSize = 4;
    const skip = (page - 1) * pageSize;

    const totalMenuItems = await Menu.countDocuments();
    const totalPages = Math.ceil(totalMenuItems / pageSize);

    const menu = await Menu.find()
      .skip(skip)
      .limit(pageSize);

    res.render("list", {
      pageContent: "list",
      pageTitle: "MENU",
      menu,
      total: totalMenuItems,
      page: parseInt(page),
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).send("Error fetching menu items");
  }
});

mongoose.connect("mongodb://localhost:27017/bakery-menu").then((data) => {
  console.log("DB Connected");
});
server.listen(3000, () => {
  console.log("Server started at localhost:3000");
});

