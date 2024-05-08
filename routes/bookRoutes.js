const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

// import models
const BookModel = require("../models/bookModel");
const IssueModel = require("../models/issueModel");
const AuthorModel = require("../models/authorModel");
const User = require("../models/User");
const GenreModel = require("../models/genreModels")

// Get add book form
router.get("/books/addBook", async (req, res) => {
    let authors = await AuthorModel.find();
    let genres = await GenreModel.find();
    console.log("Genres available", genres)
    res.render("add_book", {
      authors: authors,
      genres: genres,
      title: "Register Book form",
      currentUser: req.session.user,
    });
    // console.log("These are authors", items);
});

// add book
router.post("/books/addBook", async (req, res) => {
    try {
      const existingBook= await BookModel.findOne({
        bookId: req.body.bookId,
      });
      if (existingBook) {
        return res.status(400).send("Not registered, a book with a similar Id already exists!");
      }    
      const newBook = new BookModel(req.body);
      console.log("my new book", book);
      await newBook.save();
      // res.redirect("/books/booklist");
      res.redirect("/books/addBook");
    } catch (err) {
      res.status(400).render("add_book", { tittle: "Add book" });
      console.log("add book error", err);
    }
});

// Retrieve all books in the lib
router.get("/books/booklist", async (req, res) => {
    try {
      let items = await BookModel.find().sort({$natural:-1})
        .populate("authorName", "fullName")
        .populate("genre", "genreName")
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
});

// Get list of Available books from the lib
router.get("/books/availablelist", async (req, res) => {
    try {
      let items = await BookModel.find({ status: "available" }).sort({$natural:-1})
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
});

// get update book form
router.get("/books/updateBook/:id", async (req, res) => {
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
});

// update book
router.post("/books/updateBook", async (req, res) => {
    try {
      await BookModel.findByIdAndUpdate({ _id: req.query.id }, req.body);
      res.redirect("/books/booklist");
    } catch (err) {
      res.status(404).send("Unable to update item in the database");
    }
});

// delete book
router.post("/books/deleteBook", async (req, res) => {
    try {
      await BookModel.deleteOne({ _id: req.body.id });
      res.redirect("back");
    } catch (err) {
      res.status(400).send("Unable to delete item in the database");
    }
});

// Borrow a book from the library
router.get("/books/issueBook/:id", async (req, res) => {
    try {
      let users = await User.find();
      const bookIssue = await BookModel.findOne({ _id: req.params.id })
      .populate("bookId bookName genre", "bookId bookName genre")

      res.render("issue_book", {
        book: bookIssue,
        // genre:genre,
        users: users,
        currentUser: req.session.user,
      });
    } catch (err) {
      res.status(400).send("Unable to find item in the database");
    }
});
// working
// router.post("/books/issueBook", async (req, res) => {
//     try {
//       const book = new IssueModel(req.body);
//       await book.save();
//       res.redirect("/books/issuedBooklist");
//     } catch (err) {
//       res.status(500).send("Internal Server Error");
//       console.log("Issue book error", err)
//     }
// });
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Route to handle borrowing a book
router.post('/books/issueBook/:id', async (req, res) => {
  try {
      const { copiesBorrowed} = req.body;
      // Find the book by its ID in the BookModel
      const book = await BookModel.findById({ _id: req.params.id });
      if (!book) {
        return res.status(404).send('book not found');
      }
  
      if (book.numCopies < copiesBorrowed) {
        return res.status(400).send(`Not enough books in stock,there are ${book.numCopies} copies in stock`);
      }
  
      // If the book exists and has available copies
      if (book && book.numCopies > 0) {
          // Create a new entry in the IssueModel for the borrowed book
          const borrowedBook = new IssueModel({
              bookId: req.body.bookId, // Store the book ID in the borrowed book entry
              bookName:req.body.bookName,
              genre: req.body.genre,
              borrower: req.body.borrower,
              issueDate: req.body.issueDate,
              specifiedReturnDate:req.body.specifiedReturnDate,
              copiesBorrowed:req.body.copiesBorrowed,
              status:req.body.status 
          });

          // Save the borrowed book to the IssueModel
          await borrowedBook.save();
               // Update the copies count in the BookModel by decrementing the number of copies borrowed
          // book.numCopies -= 1; // Assuming one copy is borrowed at a time
          book.numCopies -= copiesBorrowed; // subtract by the number of copies borrowed
          // Save the updated book to the BookModel
          await book.save();

          // Return a success response
          // return res.status(200).json({ message: 'Book borrowed successfully' });
          res.redirect("/books/issuedBooklist");
      } else {
          // Return an error response if the book doesn't exist or has no available copies
          return res.status(404).json({ error: 'Book not found or no available copies' });
      }
  } catch (error) {
      // Return an error response if there's any issue with the database operation
      console.error('Error borrowing book:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Retrieve list of issued books from the database
router.get("/books/issuedBooklist", async (req, res) => {
    try {
      let items = await IssueModel.find({ status: "borrowed" }).sort({$natural:-1})
        .populate("borrower", "fullName")
        .populate("bookId bookName", "bookId bookName")
        let numborrowedBooks = await IssueModel.countDocuments({
        status: "borrowed",
      });
      console.log("borrowed books,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", items)
      res.json({message: items})
      // res.render("books_issued_list", {
      //   title: "Borrowed Books",
      //   books: items,
      //   numborrowedBooks: numborrowedBooks,
      //   currentUser: req.session.user,
      // });
    } catch (err) {
      res.status(400).send("Unable to find items in the database");
    }
});

// // Retrieve list of issued books from the database
// router.get("/books/issuedBooklist", async (req, res) => {
//     try {
//       let items = await IssueModel.find({ status: "borrowed" })
//       .populate("bookId bookName", "bookId bookName").populate('borrower', 'fullName');
//         // .populate("borrower", "fullName")
//         // .populate("bookId genre bookName", "bookId genre bookName");
//       let numborrowedBooks = await IssueModel.countDocuments({
//         status: "borrowed",
//       });
//       res.render("books_issued_list", {
//         title: "Borrowed Books",
//         books: items,
//         numborrowedBooks: numborrowedBooks,
//         currentUser: req.session.user,
//       });
//     } catch (err) {
//       res.status(400).send("Unable to find items in the database");
//       console.log("cant find items in db error", err)
//     }
// });


// Get list of books overdue
router.get('/books/overdueBooklist', async (req, res) => {
  try {    // Return aggregations for all milk purchase
    // let totalMilkExpenses = await Purchase.aggregate([
    //   { $match: { item: 'milk' }},
    //   { $group: { _id: null},
    //   totalQuantity: { $sum: "$quantity" },
    //   totalCost: { $sum: '$amount' },
    //   }
    // ])

    // Return aggregations for all Fruit expenses
    //   let totalFruitExpenses = await Purchase.aggregate([
    //     { $match: { item: 'fruits' } },
    //     { $group: { _id: null,

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
// });

// Route to find the most popular book
router.get('/popular-book', async (req, res) => {
  try {
      const popularBook = await IssueModel.aggregate([
          // Group by bookId and count the total number of copies borrowed
          {
              $group: {
                  _id: '$bookId',
                  totalCopiesBorrowed: { $sum: '$copiesBorrowed' }
              }
          },
          // Sort in descending order of totalCopiesBorrowed
          { $sort: { totalCopiesBorrowed: -1 } },
          // Limit to the first document (most popular book)
          { $limit: 1 },
          // Lookup the book details from the BookModel collection
          {
              $lookup: {
                  from: 'BookModel',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'bookDetails'
              }
          },
          // Project only the relevant fields
          {
              $project: {
                  _id: 0,
                  bookName: { $arrayElemAt: ['$bookDetails.bookName', 0] },
                  totalCopiesBorrowed: 1
              }
          }
      ]);
    //   const popularBook = await IssueModel.aggregate([
    //     {
    //         $group: {
    //             _id: '$bookName', 
    //             totalBorrows: { $sum: '$copiesBorrowed' } 
    //         }
    //     },
    //     {
    //         $sort: { totalBorrows: -1 } 
    //     },
    //     {
    //         $limit: 1 
    //     }
    // ]);
      console.log("Popular book in the lib",popularBook[1])
      if (popularBook.length > 0) {
          res.json(popularBook[1]);
      } else {
          console.log('No popular book found');
          res.status(404).json({ message: 'No popular book found' });
      }
  } catch (error) {
      console.error('Error finding popular book:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// get return book form
router.get("/books/returnBook/:id", async (req, res) => {
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
});

// Return book
router.post("/books/returnBook", async (req, res) => {
    try {
      await IssueModel.findByIdAndUpdate({ _id: req.query.id }, req.body);
      res.redirect("/books/issuedBooklist");
    } catch (err) {
      res.status(404).send("Unable to update item in the database");
      console.log("Return book error", err)
    }
});

module.exports = router;
