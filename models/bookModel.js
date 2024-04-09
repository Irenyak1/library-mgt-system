const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  bookId: {
    type: String,
    trim: true,
  },
  bookName: {
    type: String,
    trim: true,
  },
  authorName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthorModel",
  },
  genre: {
    type: String,
    trim: true,
  },
  numCopies: {
    type: Number,
    trim: true,
  },
  status: {
    type: String,
    default: "available",
    trim: true,
  }
});

module.exports = mongoose.model("BookModel", bookSchema);
