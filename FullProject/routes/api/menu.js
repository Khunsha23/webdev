const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const Menu = require("../../models/Menu");

router.get("/menu/new", async (req, res) => {
  res.render("menu/new");
});
router.post("/menu/new", async (req, res) => {
  let record = new Menu(req.body);
  await record.save();
  return res.redirect("/menu");

});
router.get("/menu/:id/delete", async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  return res.redirect("/menu");
});

router.get("/menu/:id/edit", async (req, res) => {
  let menu = await Menu.findById(req.params.id);
  return res.render("edit", {menu, layout: false});
});

router.post("/menu/:id/edit", async (req, res) => {
  let menu = await Menu.findById(req.params.id);
  menu.title = req.body.title;
  menu.price = req.body.price;
  menu.description = req.body.description;
  await menu.save();
  return res.redirect("/menu");
});

router.get("/menu/:page?", async (req, res) => {
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


module.exports = router;