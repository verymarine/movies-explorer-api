const { celebrate, Joi } = require('celebrate');
const express = require('express');

const router = express.Router();

const {
  getUser, patchUser
} = require('../controllers/user');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
 }), patchUser);

 module.exports = router;