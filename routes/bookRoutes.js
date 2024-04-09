const express = require("express");
const router = express.Router();

// import models
const BookModel = require("../models/bookModel");
const IssueModel = require("../models/issueModel");
const AuthorModel = require("../models/authorModel");
const User = require("../models/User");

// Get add book form
router.get("/books/addBook", async (req, res) => {
  if (req.session.user) {
    let items = await AuthorModel.find();
    res.render("add_book", {
      authors: items,
      title: "Register Book form",
      currentUser: req.session.user,
    });
    console.log("These are authors", items);
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// add book
router.post("/books/addBook", async (req, res) => {
  if (req.session.user) {
    try {
      const book = new BookModel(req.body);
      console.log("my new book", book);
      await book.save();
      res.redirect("/books/booklist");
    } catch (err) {
      res.status(400).render("add_book", { tittle: "Add book" });
      console.log(err);
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// Retrieve all books in the lib
router.get("/books/booklist", async (req, res) => {
  if (req.session.user) {
    try {
      let items = await BookModel.find()
        .populate("authorName", "fullName")
        .exec();
      if (req.query.genre) {
        items = await BookModel.find({ genre: req.query.genre });
      }
      res.render("books_list", {
        title: "Books list",
        books: items,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// Get list of Available books from the lib
router.get("/books/availablelist", async (req, res) => {
  if (req.session.user) {
    try {
      let items = await BookModel.find({ status: "available" })
        .populate("authorName", "fullName")
        .exec();
      if (req.query.genre) {
        items = await BookModel.find({ genre: req.query.genre });
      }
      res.render("books_available_list", {
        title: "Available Books",
        books: items,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// get update book form
router.get("/books/updateBook/:id", async (req, res) => {
  if (req.session.user) {
    try {
      const updateBook = await BookModel.findOne({ _id: req.params.id });
      res.render("edit_book", {
        book: updateBook,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find item in the database");
      console.log(err);
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// update book
router.post("/books/updateBook", async (req, res) => {
  if (req.session.user) {
    try {
      await BookModel.findByIdAndUpdate({ _id: req.query.id }, req.body);
      res.redirect("/books/booklist");
    } catch (err) {
      res.status(404).send("Unable to update item in the database");
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// delete book
router.post("/books/deleteBook", async (req, res) => {
  if (req.session.user) {
    try {
      await BookModel.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (err) {
      res.status(400).send("Unable to delete item in the database");
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// Borrow a book from the library
router.get("/books/issueBook/:id", async (req, res) => {
  if (req.session.user) {
    try {
      let users = await User.find();
      const bookIssue = await BookModel.findOne({ _id: req.params.id });
      res.render("issue_book", {
        book: bookIssue,
        users: users,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find item in the database");
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

router.post("/books/issueBook", async (req, res) => {
  if (req.session.user) {
    try {
      const book = new IssueModel(req.body);
      await book.save();
      res.redirect("/books/issuedBooklist");
    } catch (err) {
      res.status(500).send("Internal Server Error");
      console.log("Issue book error", err)
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// Retrieve list of issued books from the database
router.get("/books/issuedBooklist", async (req, res) => {
  if (req.session.user) {
    try {
      let items = await IssueModel.find({ status: "borrowed" })
        .populate("borrower", "fullName")
        .populate("bookId genre bookName", "bookId genre bookName");
      let numborrowedBooks = await IssueModel.countDocuments({
        status: "borrowed",
      });
      res.render("books_issued_list", {
        title: "Borrowed Books",
        books: items,
        numborrowedBooks: numborrowedBooks,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// Get list of books overdue
router.get('/books/overdueBooklist', async (req, res) => {
  try {
      const today = new Date();
      const overdueBooks = await IssueModel.find({ specifiedReturnDate: { $lt: today } })
        .populate("borrower", "fullName")
        .populate("bookId genre bookName", "bookId genre bookName");
      
      // const overduecopies = await IssueModel.aggregate({ specifiedReturnDate: { $lt: today } })
      
      const overdueCount = await IssueModel.aggregate([
        {$match: {specifiedReturnDate: { $lt: today }}},
        {
          $group: {
            _id: null,
            totalCopiesOverdue: { $sum: "$copiesBorrowed" },
          },
        },
        // {$count: "overdueCopiesCount" }
      ]);
      
      res.render("books_overdue", {
        title: "Books Overdue",
        books: overdueBooks,
        // overduecopies:overduecopies,
        // copiesOverdue: overdueCount[0],
        currentUser: req.session.user
      });
  } catch (error) {
      console.error('Error fetching overdue books:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// // Retrieve list of overdue books from the database
// router.get("/books/overdueBooklist", async (req, res) => {
//   if (req.session.user) {
//     try {
//       let items = await IssueModel.find({ status: "borrowed" })
//         .populate("borrower", "fullName")
//         .populate("bookId genre bookName", "bookId genre bookName");
//       let numOverdueBooks = await IssueModel.countDocuments({
//         status: "borrowed", 
//       });
//       res.render("books_overdue", {
//         title: "Books Overdue",
//         books: items,
//         numborrowedBooks: numborrowedBooks,
//         currentUser: req.session.user,
//       });
//     } catch (err) {
//       res.status(400).send("Unable to find items in the database");
//     }
//   } else {
//     console.log("Can't find session");
//     res.redirect("/login");
//   }
// });





// get return book form
router.get("/books/returnBook/:id", async (req, res) => {
  if (req.session.user) {
    try {
      const bookreturn = await IssueModel.findOne({ _id: req.params.id })
        .populate("borrower", "fullName")
        .populate("bookId bookName genre", "bookId bookName genre");
      res.render("return_book", {
        book: bookreturn,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find item in the database");
      console.log(err);
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

// Return book
router.post("/books/returnBook", async (req, res) => {
  if (req.session.user) {
    try {
      await IssueModel.findByIdAndUpdate({ _id: req.query.id }, req.body);
      res.redirect("/books/issuedBooklist");
    } catch (err) {
      res.status(404).send("Unable to update item in the database");
      console.log("Return book error", err)
    }
  } else {
    console.log("Can't find session");
    res.redirect("/login");
  }
});

module.exports = router;
