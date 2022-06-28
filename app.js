require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const path = require('path');

const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NotFound');



const allowedCors = [
  'https://moviehub.nomoredomains.xyz',
  'http://moviehub.nomoredomains.xyz',
  'https://localhost:3001',
  'http://localhost:3001',
  'http://localhost:3000',
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
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// //Использование пакета dotenv для чтения переменных из файла .env в Node
// require('dotenv').config();
// var MongoClient = require('mongodb').MongoClient;

// // Обращение к переменным из .env, которые теперь доступны в process.env
// MongoClient.connect(process.env.DB_CONN, function(err, db) {
//   if(!err) {
//     console.log("We are connected");
//   }
// });

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

//   app.get('/crash-test', () => {
//     setTimeout(() => {
//       throw new Error('Сервер сейчас упадёт');
//     }, 0);
//   });



// регистраци и логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().trim(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().trim(),
  }),
}), createUser);



// app.use(auth);


// пользователь и кино

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

// app.use('/', require('./routes/index'));

// app.use('*', auth, (req, res, next) => {
//   next(new NotFound('Страницы не существует'));
// });

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`server listen port ${PORT}`);
});
