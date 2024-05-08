const express = require("express");
const router = express.Router();
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");

// Get the models
const Registration = require("../models/Registration");
const AuthorModel = require("../models/authorModel");
const BookModel = require("../models/bookModel");
const IssueModel = require("../models/issueModel");
const User = require("../models/User");
const GenreModel = require("../models/genreModels.js");

// Get Admin signup form
router.get("/register", (req, res) => {
  res.render("signup", { title: "Signup form" });
});

// Register admin
router.post("/register", async (req, res) => {
  try {
    const existingUser = await Registration.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("Not registered, a user with a similar email already exists!");
    }
      const user = new Registration(req.body);
      await Registration.register(user, req.body.password, (err) => {
        if (err) {
          throw err;
        }
        res.redirect("/login");
      });
  } catch (err) {
    res.status(400).render("signup", { tittle: "Signup" });
    console.log("Signup user error", err);
  }
});

// Get login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login admin
router.post( "/login",   passport.authenticate("local", { failureRedirect: "/login" }),(req, res) => {
    req.session.user = req.user;
    res.redirect("/admin/dashboard");
  }
);

//Logged in admin getting their dashboard
router.get("/admin/dashboard", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    try {
      let authors = await AuthorModel.find();
      let numAuthors = await AuthorModel.countDocuments();
      let numGenres = await GenreModel.countDocuments();

      let users = await User.find();
      let numUsers = await User.countDocuments();

      let varbooksInLib = await BookModel.find();
      let numVarBooksInLib = await BookModel.countDocuments();

      let borrowedBooks = await BookModel.find({ status: "borrowed" });
      let numBorrowedBooks = await IssueModel.countDocuments({
        status: "borrowed",
      });
      let availableBooks = await BookModel.find({ status: "available" });
      let numAvailableBooks = await BookModel.aggregate([
        { $match: { status: "available" } },
        {
          $group: {
            _id: null,
            totalCopiesAvailable: { $sum: "$numCopies" },
          },
        },
      ]);

      let aggregationResult = await BookModel.aggregate([
        {
          $group: {
            _id: null,
            totalCopies: { $sum: "$numCopies" },
          },
        },
      ]);

      // Books overdue
      const allIssues = await IssueModel.find();

      const currentDate = new Date();

      const overdueDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

      let totalOverdueCopies = 0;

      allIssues.forEach((issue) => {
        const specifiedReturnDate = new Date(issue.specifiedReturnDate);
        const issueDate = new Date(issue.issueDate);

        const difference = specifiedReturnDate.getTime() - issueDate.getTime();

        if (difference > overdueDuration) {
          totalOverdueCopies += issue.copiesBorrowed;
        }
      });

      // Popular Book Name/Title
      const popularBook = await IssueModel.aggregate([
        { $match: { status: "borrowed" } },
        {
          $group: {
            _id: "$bookName",
            totalBorrows: { $sum: "$copiesBorrowed" },
          },
        },
        {
          $sort: { totalBorrows: -1 },
        },
        {
          $limit: 1,
        },
      ]);
      popularBook.length > 0 ? popularBook : 0;

      // Popular Genre
      const popularGenre = await IssueModel.aggregate([
        { $match: { status: "borrowed" } },
        {
          $group: {
            _id: "$genre",
            totalBorrows: { $sum: "$copiesBorrowed" },
          },
        },
        {
          $sort: { totalBorrows: -1 },
        },
        {
          $limit: 1,
        },
      ]);
      popularGenre.length > 0 ? popularGenre : 0;

      // console.log("from admin side book", popularBook);
      // console.log("from admin side genre", popularGenre);

      res.render("admin_dashboard", {
        numAuthors: numAuthors,
        numGenres: numGenres,
        numUsers: numUsers,
        numVarBooksInLib: numVarBooksInLib,
        numBorrowedBooks: numBorrowedBooks,
        availableBooks: numAvailableBooks[0],
        copies: aggregationResult[0],
        overdue: totalOverdueCopies,
        popBook: popularBook[0],
        popGenre: popularGenre[0],
        title: "Admin Dashboard",
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find details from the db");
      console.log("error getting overdue", err);
    }
});

// Route to find the popular genre among borrowed books
router.get("/popular-genre", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const popularGenre = await IssueModel.aggregate([
      // Match documents with status 'borrowed'
      { $match: { status: "borrowed" } },
      // Group by genre and count the total number of copies borrowed for each genre
      {
        $group: {
          _id: "$genre",
          totalCopiesBorrowedGenre: { $sum: "$copiesBorrowed" },
        },
      },
      // Sort in descending order of totalCopiesBorrowed
      { $sort: { totalCopiesBorrowedGenre: -1 } },
      // Limit to the first document (most popular genre)
      { $limit: 1 },
    ]);

    if (popularGenre.length > 0) {
      res.json(popularGenre[0]);
    } else {
      console.log("No popular genre found");
      res.status(404).json({ message: "No popular genre found" });
    }
  } catch (error) {
    console.error("Error finding popular genre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out");
      }
      res.redirect("/");
    });
  }
});

module.exports = router;
