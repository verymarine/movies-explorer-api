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
    image: Joi.string().required(),
    // (/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i)
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required(),
    // (/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i)
    movieId: Joi.number().required(),
    trailerLink: Joi.string().required(),
    // _id: Joi.string().length(24).hex(),
    // (/https?:\/\/(www\.)?[-\w@:%\\.\\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\\.\\+~#=//?&]*)/i)
  }),
}), postFavoriteMovie);

router.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.number(),
  }),
}), deleteFavoriteMovie);
// router.delete('/movies/:movieId', deleteFavoriteMovie);

module.exports = router;
