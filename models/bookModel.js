const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  bookId: {
    type: String,
    trim: true,
    unique: true
  },
  bookName: {
    type: String,
    trim: true,
  },
  authorName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthorModel",
  },
  // genre: {
  //   type: String,
  //   trim: true,
  // },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenreModel",
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
