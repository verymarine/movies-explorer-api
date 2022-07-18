const mongoose = require('mongoose');
// const validator = require('validator');

const movieSchema = new mongoose.Schema({
  nameEN: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
    // type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],не факт что правильно проверить
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
