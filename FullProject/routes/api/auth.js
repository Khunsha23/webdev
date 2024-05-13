const express= require("express");
const req = require("express/lib/request");
let router= express.Router();
let User = require("../../models/User");
router.get("/register",async (req,res)=>{
    res.render("register")
})

router.post("/register", async function (req, res) {
    let user = await User.findOne({
      email: req.body.email,
    });
    if(user){
        res.flash("danger", "User Already Exist");
        return res.redirect("/register");
    }
    user = new User(req.body)
    await user.save()
    res.flash("success","Registered successfully!")
    res.redirect("/login")

  });

  router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.flash("danger", "User doesn't exist or incorrect credentials!");
        return res.redirect("/login");
    }
    if (user.password != req.body.password) {
        res.flash("danger", "Invalid Password");
        return res.redirect("/login");
    }
    req.session.user = user;
    res.flash("success", user.name + " Logged In");
    return res.redirect("/");
});

    router.get("/login",(req,res)=>{
        res.render("login")
    })
    router.get("/logout", (req, res) => {
      req.session.user = null;
      res.flash("success", "Logged out Successfully");
      res.redirect("/login");
    });
module.exports= router