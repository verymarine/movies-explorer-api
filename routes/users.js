const { celebrate, Joi } = require('celebrate');
const express = require('express');

const router = express.Router();

const {
  getUser, patchUser,
} = require('../controllers/user');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), patchUser);

module.exports = router;
