
const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const req = require("express/lib/request");
const router = express.Router();
const isAdmin = require("../../middlewares/isAdmin"); 

const Menu = require("../../models/Menu");

router.get("/menu/new", isAdmin,async (req, res) => {
  res.render("new");
});
router.post("/menu/new",isAdmin, upload.single('image'), async (req, res) => {
  try {
    let record = new Menu({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.file.buffer 
    });
    await record.save();
    return res.redirect("/menu");
  } catch (error) {
    res.status(500).send("Error saving menu item: " + error);
  }
});
router.get("/menu/:id/delete",isAdmin, async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  return res.redirect("/menu");
});

router.get("/menu/:id/edit",isAdmin, async (req, res) => {
  let menu = await Menu.findById(req.params.id);
  return res.render("edit", {menu, layout: false});
});

router.post("/menu/:id/edit",isAdmin, upload.single('image'), async (req, res) => {
  try {
    let menu = await Menu.findById(req.params.id);
    if (menu) {
      menu.title = req.body.title;
      menu.price = req.body.price;
      menu.description = req.body.description;
      if (req.file) {
        menu.image = req.file.buffer; 
      }
      await menu.save();
      return res.redirect("/menu");
    } else {
      res.status(404).send("Menu item not found");
    }
  } catch (error) {
    res.status(500).send("Error updating menu item: " + error);
  }
});
router.get("/menu/:page?", async (req, res) => {
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


module.exports = router;