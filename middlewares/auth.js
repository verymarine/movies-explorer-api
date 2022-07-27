const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // const { token } = req.cookies;
  // const token = req.headers;
  // const token = req.headers.cookies;
  const token = req.headers.authorization || req.headers;
  console.log(token, 'token auth');
  // console.log(req.cookies.token, 'req.cookies.token');
  if (!token) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  let payload;

  // верифицируем токен
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  console.log(req.user, 'req.user'); // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
