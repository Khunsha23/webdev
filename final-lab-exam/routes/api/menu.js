
const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const req = require("express/lib/request");
const router = express.Router();
const isAdmin = require("../../middlewares/isAdmin"); 

const Menu = require("../../models/Menu");
const authenticate = require("../../middlewares/authenticate")

router.get("/menu/search", async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = 2;
    const skip = (page - 1) * pageSize;

    if (!req.session.searchHistory) {
      req.session.searchHistory = [];
    }

    if (searchTerm && !req.session.searchHistory.includes(searchTerm)) {
      req.session.searchHistory.push(searchTerm);
    }

    if (req.session.searchHistory.length > 10) {
      req.session.searchHistory.shift();
    }

    const searchQuery = searchTerm ? {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } }
      ]
    } : {};

    const totalMenuItems = await Menu.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMenuItems / pageSize);

    const menu = await Menu.find(searchQuery).skip(skip).limit(pageSize);

    res.render("search", {
      pageTitle: "Search Menu",
      menu,
      total: totalMenuItems,
      page: page,
      pageSize,
      totalPages,
      user: req.session.user,
      searchHistory: req.session.searchHistory,
      searchTerm: searchTerm
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).send("Error fetching menu items");
  }
});


router.get("/menu/new", isAdmin,async (req, res) => {
  console.log("/menu/new")
  res.render("new");
});
router.get("/search", async (req, res) => {
  try {
    if (!req.session.searchHistory) {
      req.session.searchHistory = [];
    }

    res.render("search", {
      pageTitle: "Search Menu",
      menu: [], 
      total: 0, 
      page: 1,
      pageSize: 4,
      totalPages: 0,
      user: req.session.user,
      searchHistory: req.session.searchHistory,
      searchTerm: ''
    });
  } catch (error) {
    console.error("Error rendering search page:", error);
    res.status(500).send("Error rendering search page");
  }
});
router.post("/menu/new",isAdmin, upload.single('image') ,async (req, res) => {
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
  console.log("/menu/delete")

  return res.redirect("/menu");
});

router.get("/menu/:id/edit",isAdmin ,async (req, res) => {
  let menu = await Menu.findById(req.params.id);
  console.log("/menu/edit")

  return res.render("edit", {menu, layout: false});
});

router.post("/menu/:id/edit",isAdmin, upload.single('image'),async (req, res) => {
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