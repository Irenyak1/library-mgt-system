const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

// Get the Registration model
const AuthorModel = require("../models/authorModel");

// Get add author form
router.get("/authors/addAuthor", (req, res) => {
    res.render("add_author", {
      title: "Register Author form",
      currentUser: req.session.user,
    });
});

// add author
router.post("/authors/addAuthor", async (req, res) => {
    try {
      const existingAuthor = await AuthorModel.findOne({
        authorId: req.body.authorId,
      });
      if (existingAuthor) {
        return res
          .status(400)
          .send("Not registered, an author with a similar Id already exists!");
      }      
        const author = new AuthorModel(req.body);
        await author.save();
      // res.redirect("/authors/authorlist");
      res.redirect("/authors/addAuthor");
   } catch (err) {
      res.status(400).render("add_author", { tittle: "Add author" });
      console.log("add author error", err);
    }
});

// retrieve authors from the database
router.get("/authors/authorlist", async (req, res) => {
    try {
      let items = await AuthorModel.find().sort({$natural:-1});
      res.render("authors_list", {
        title: "authors list",
        authors: items,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
});

// get update author form
router.get("/authors/updateAuthor/:id", async (req, res) => {
    try {
      const updateAuthor = await AuthorModel.findOne({ _id: req.params.id });
      res.render("edit_author", {
        author: updateAuthor,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find item in the database");
    }
});

// post updated user
router.post("/authors/updateAuthor/", async (req, res) => {
    try {
      await AuthorModel.findOneAndUpdate({ _id: req.query.id }, req.body);
      res.redirect("/authors/authorlist");
    } catch (err) {
      res.status(404).send("Unable to update item in the database");
    }
});

// Delete author
router.post("/authors/deleteAuthor", async (req, res) => {
    try {
      await AuthorModel.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (err) {
      res.status(400).send("Unable to delete author in the database");
    }
});

module.exports = router;
