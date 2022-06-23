const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Movie = require('../bitfilmsdb/movie');
const movie = require('../bitfilmsdb/movie');
// добавить классы ошибок после того как сделаю



// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies

module.exports.getFavoriteMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).populate('owner');
    if (movies) {
      res.status(200).send(movies);
    }
  } catch (err) {
    next(err);
  }
};


// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

module.exports.postFavoriteMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      trailerLink
    } = req.body;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      trailerLink
    });// HERE SHOULD BE SMTH
    // movie = await movie.populate('owner');
    if (movie) {
      res.status(200).send(movie);
    }
  } catch (err) {
    next(err);
  }
};



// # удаляет сохранённый фильм по id
// DELETE /movies/_id

module.exports.deleteFavoriteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params._id)
      .populate('owner');

    if (movie) {
      res.status(200).send(movie);
    } else {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
