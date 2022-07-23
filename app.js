require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const limiter = require('./middlewares/limiter');

const NotFound = require('./errors/NotFound');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, DB_CONN } = process.env;

const allowedCors = [
  'https://api.moviehub.nomoredomains.xyz',
  'http://api.moviehub.nomoredomains.xyz',
  'https://moviehub.nomoredomains.xyz',
  'http://moviehub.nomoredomains.xyz',
  'https://api.nomoreparties.co/beatfilm-movies',
  'http://api.nomoreparties.co/beatfilm-movies',
  'https://localhost:3001',
  'http://localhost:3001',
  'http://localhost:3000',
  'https://localhost:3000',
];

// вызов нашего модуля
const app = express();

// переменная окружения
const { PORT = 3000 } = process.env;

app.use(cors({
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin: allowedCors,
  credentials: true,
}));

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? DB_CONN : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

//   app.get('/crash-test', () => {
//     setTimeout(() => {
//       throw new Error('Сервер сейчас упадёт');
//     }, 0);
//   });

// Use to limit repeated requests to public API
app.use(limiter);

// регистраци и логин
app.use(require('./routes/auth'));

app.use(auth);

// пользователь и кино
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

// app.use(require('./routes/index'));

app.use('*', auth, (req, res, next) => {
  next(new NotFound('Страницы не существует'));
});

app.use(errorLogger);

app.use(errors());

// app.use(error);

app.listen(PORT, () => {
  console.log(`server listen port ${PORT}`);
});
