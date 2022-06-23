
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getFavoriteMovies, postFavoriteMovie, deleteFavoriteMovie } = require('../controllers/movie');


router.get('/', getFavoriteMovies);
router.post('/', postFavoriteMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteFavoriteMovie);

module.exports = router;
