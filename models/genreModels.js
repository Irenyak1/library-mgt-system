const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    genreName: { 
      type: String,
      unique: true,
      trim: true
    }
    
});

module.exports = mongoose.model("GenreModel", genreSchema);
