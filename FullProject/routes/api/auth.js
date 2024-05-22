const express= require("express");
const req = require("express/lib/request");
let router= express.Router();
let User = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get("/register",async (req,res)=>{
    res.render("register")
})

router.post("/register", async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        res.flash("danger", "User already exists");
        return res.redirect("/register");
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10); 
  
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      await user.save();
  
      res.flash("success", "Registered successfully!");
      res.redirect("/login");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  router.post("/login", async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.flash("danger", "User doesn't exist or incorrect credentials!");
        return res.redirect("/login");
      }
  
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.flash("danger", "Invalid Password");
        return res.redirect("/login");
      } 
      const token = user.generateAuthToken();
      user.save();  
      res.cookie("token", token, { httpOnly: true });

      req.session.user = user;
      res.flash("success", `${user.name} Logged In`);

      return res.redirect("/");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  

    router.get("/login",(req,res)=>{
        res.render("login")
    })
    router.get("/logout", (req, res) => {
        try {
          res.clearCookie("token"); 
          res.clearCookie("connect.sid"); 

          res.flash("success", "Logged out Successfully");
          res.redirect("/login");
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Server Error");
        }
      });
module.exports= router