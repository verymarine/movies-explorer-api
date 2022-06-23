// Все роуты подключены в файле index.js,
//  который находится в папке routes.
// Оттуда единый роут подключается в файле app.js / 2.14

const { celebrate, Joi } = require('celebrate');
const express = require('express');

const router = express.Router();

const {
  getUser, patchUser
} = require('../controllers/user');

const { getFavoriteMovies, postFavoriteMovie, deleteFavoriteMovie } = require('../controllers/movie');

//USERS
router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), patchUser);

// MOVIES
router.get('/movies/', getFavoriteMovies);
router.post('/movies/', postFavoriteMovie);
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteFavoriteMovie);
module.exports = router;
