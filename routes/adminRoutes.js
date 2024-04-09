const express = require("express");
const router = express.Router();
const passport = require("passport");

// Get the models
const Registration = require("../models/Registration");
const AuthorModel = require("../models/authorModel");
const BookModel = require("../models/bookModel");
const IssueModel = require("../models/issueModel");
const User = require("../models/User");

// Get Admin signup form
router.get("/register", (req, res) => {
  res.render("signup", { title: "Signup form" });
});

// Register admin
router.post("/register", async (req, res) => {
  try {
    const items = new Registration(req.body);
    await Registration.register(items, req.body.password, (err) => {
      if (err) {
        throw err;
      }
      res.redirect("/login");
    });
  } catch (err) {
    res.status(400).send("Sorry! Something went wrong.");
  }
});

// Get login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login admin
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/admin/dashboard");
  }
);

//Logged in admin getting their dashboard
router.get("/admin/dashboard", async (req, res) => {
  if (req.session.user) {
    try {
      let authors = await AuthorModel.find();
      let numAuthors = await AuthorModel.countDocuments();

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

      const allIssues = await IssueModel.find();

      const currentDate = new Date();

      const overdueDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

      let totalOverdueCopies = 0;

      allIssues.forEach(issue => {
          const specifiedReturnDate = new Date(issue.specifiedReturnDate);
          const issueDate = new Date(issue.issueDate);

          const difference = specifiedReturnDate.getTime() - issueDate.getTime();

          if (difference > overdueDuration) {
             totalOverdueCopies += issue.copiesBorrowed;
          }
      });

      const popularBook = await IssueModel.aggregate([
        {
            $group: {
                _id: '$bookName', 
                totalBorrows: { $sum: '$copiesBorrowed' } 
            }
        },
        {
            $sort: { totalBorrows: -1 } 
        },
        {
            $limit: 1 
        }
    ]);
        popularBook.length > 0 ? popularBook : 0
    

      

       res.render("admin_dashboard", {
        numAuthors: numAuthors,
        numUsers: numUsers,
        numVarBooksInLib: numVarBooksInLib,
        numBorrowedBooks: numBorrowedBooks,
        availableBooks: numAvailableBooks[0],
        copies: aggregationResult[0],
        overdue:totalOverdueCopies,
        popularBook:popularBook,
        title: "Admin Dashboard",
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find details from the db");
      console.log("error getting overdue", err)
    }
  } else {
    res.redirect("/login");
  }
});

// Logout route
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out");
      }
      res.redirect("/login");
    });
  }
});

module.exports = router;
