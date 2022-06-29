const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getFavoriteMovies, postFavoriteMovie, deleteFavoriteMovie } = require('../controllers/movie');

router.get('/movies', getFavoriteMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i), // image — ссылка на постер к фильму. Обязательное поле-строка.
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i), // thumbnail — миниатюрное изображение постера к фильму.
    movieId: Joi.number().required(),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i), // trailerLink — ссылка на трейлер фильма.
  }),
}), postFavoriteMovie);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteFavoriteMovie);

module.exports = router;
