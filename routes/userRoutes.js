const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

// Get the User Model
const User = require("../models/User");

// Get add user form
router.get("/users/addUser", (req, res) => {
    res.render("add_user", {
      title: "Add user form",
      currentUser: req.session.user,
    });
});

// add user
router.post("/users/addUser", async (req, res) => {
  const { userID, email } = req.body;
    try {
      const existingUser = await User.findOne({ $or: [{ userID }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User Id or email already exists' });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect("/users/userlist");
    // res.redirect("/users/addUser");
    } catch (err) {
      // res.status(400).render("add_user", {
      //   tittle: "Add user",
      // });
      res.status(400).json({message: "User was not added, try again"});
      console.log("Add user error", err);
    }
});

// retrieve users from the database
router.get("/users/userlist", async (req, res) => {
    try {
      let items = await User.find().sort({$natural:-1});
      res.render("users_list", {
        title: "users list",
        users: items,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
});

// get update user form
router.get("/users/updateUser/:id", async (req, res) => {
    try {
      const updateuser = await User.findOne({ _id: req.params.id });
      res.render("edit_user", {
        user: updateuser,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find item in the database");
    }
});

// post updated user
router.post("/users/updateUser", async (req, res) => {
    try {
      await User.findOneAndUpdate({ _id: req.query.id }, req.body);
      res.redirect("/users/userlist");
    } catch (err) {
      res.status(404).send("Unable to update item in the database");
    }
});

// delete user
router.post("/users/deleteUser", async (req, res) => {
    try {
      await User.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (err) {
      res.status(400).send("Unable to delete item in the database");
    }
});

module.exports = router;
