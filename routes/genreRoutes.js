const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

// Import the Genre model
const GenreModel = require("../models/genreModels.js");

// Get add genre form
router.get("/genres/addGenre", (req, res) => {
    res.render("add_genre", {
      title: "Capture Genre",
      currentUser: req.session.user,
    });
});

// add genre
router.post("/genres/addGenre", async (req, res) => {
    try {
      const existingGenre = await GenreModel.findOne({
        genreName: req.body.genreName,
      });
      if (existingGenre) {
        return res.status(400).send("Not registered, that genre already exists!");
      }
        const newGenre = new GenreModel(req.body);
        await newGenre.save();
        res.redirect("/genres/genresList");
    } catch (err) {
        res.status(400).render("add_genre", { tittle: "Add genre" });
      console.log("add genre error", err);
    }
});

// retrieve genres from the db
router.get("/genres/genrelist", async (req, res) => {
    try {
      let items = await GenreModel.find().sort({$natural:-1});
      res.render("genres_list", {
        title: "genres list",
        genres: items,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
});

// Delete author
router.post("/genres/deleteGenre", async (req, res) => {
    try {
      await GenreModel.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (err) {
      res.status(400).send("Unable to delete genre from the database");
    }
});

module.exports = router;
