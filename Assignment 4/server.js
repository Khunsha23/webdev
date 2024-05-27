const express = require("express");
const mongoose = require("mongoose");
const Menu = require("./models/Menu");
const User = require("./models/User")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const isAuthenticated = require("./middlewares/isAuthenticated");
let server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());
server.use(session({ secret: "Its  a secret" }));
server.set("view engine", "ejs");
server.use(express.static("public"));
var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);
server.use(require("./middlewares/siteMiddleware"))
const isAdmin = require("./middlewares/isAdmin"); 
const config = require("config");
const jwtPrivateKey = config.get('jwtPrivateKey');
const jwt = require('jsonwebtoken');

server.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
      if (token) {
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      req.session.user = decoded;
    } else {
      req.session.user = null;
    }
    res.render("homepage");
  } catch (error) {
    console.error("Error rendering homepage:", error);
    res.status(500).send("Server Error");
  }
});


server.use("/",require("./routes/api/auth"))
let menuApiRouter = require("./routes/api/menu");
const authenticate = require("./middlewares/authenticate");
server.use("/", menuApiRouter);


server.get("/new.html",isAdmin, (req, res) => {
  res.render("new",{layout: false},);
});


server.get("/homepage.html", (req, res) => {
  res.render( "homepage" );
});

server.get("/contact-us.html", isAuthenticated, (req, res) => {
  res.render("contact-us" );
});


server.post("/contact-us.html", isAuthenticated, (req, res) => {
  res.flash("success", "Form was submitted successfully!");
  res.redirect("/contact-us.html");
});

server.get("/menu/:page?", async (req, res) => {
  try {
    const page = req.params.page || 1; 
    const pageSize = 4;
    const skip = (page - 1) * pageSize;

    const totalMenuItems = await Menu.countDocuments();
    const totalPages = Math.ceil(totalMenuItems / pageSize);

    const menu = await Menu.find().skip(skip).limit(pageSize);

    res.render("list", {
      pageTitle: "MENU",
      menu,
      total: totalMenuItems,
      page: parseInt(page),
      pageSize,
      totalPages,
      user: req.session.user 
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).send("Error fetching menu items");
  }
});

mongoose.connect("mongodb://localhost:27017/bakery-menu").then((data) => {
  console.log("DB Connected");
});
server.listen(4000, () => {
  console.log("Server started at localhost:4000");
});

