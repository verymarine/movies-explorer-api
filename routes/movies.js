
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getFavoriteMovies, postFavoriteMovie, deleteFavoriteMovie } = require('../controllers/movie');


router.get('/', getFavoriteMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i), // image — ссылка на постер к фильму. Обязательное поле-строка.
    // Запишите её URL-адресом.
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i), // thumbnail — миниатюрное изображение постера к фильму.
    // Обязательное поле-строка. Запишите её URL-адресом.
    movieId: Joi.number().required(),
    owner: Joi.string().length(24).hex().required(),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i), // trailerLink — ссылка на трейлер фильма.
    // Обязательное поле-строка. Запишите её URL-адресом.
  }),
}), postFavoriteMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteFavoriteMovie);

module.exports = router;
