const Movie = require('../bitfilmsdb/movie');
const NotFound = require('../errors/NotFound');
// добавить классы ошибок после того как сделаю

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
module.exports.getFavoriteMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).populate('owner');
    if (movies) {
      res.send(movies);
    }
  } catch (err) {
    next(err);
  }
};

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
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
      trailerLink,

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
      trailerLink,
      owner: req.user._id,
    });
    if (movie) {
      res.send(movie);
    }
  } catch (err) {
    next(err);
  }
};

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
module.exports.deleteFavoriteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params._id).populate('owner');

    if (movie) {
      res.send(movie);
    } else {
      next(new NotFound('Фильм с таким _id не найден'));
    }
  } catch (err) {
    next(err);
  }
};
