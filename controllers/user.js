const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../bitfilmsdb/user');
// добавить классы ошибок после того как сделаю
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

const MONGO_DUBLICATE_ERROR_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;

// При использовании next в функции-контроллере
// необходимо завершать её работу ключевым словом
// return, чтобы функция не продолжала своё выполнение.

// АУНТИФИКАЦИЯ
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    bcrypt.compare(password, user.password)
      .then((matched) => {
        // if (!matched) {
        //   return next(new Unauthorized('Не удалось авторизоваться'));
        // }
        if (matched) {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

          res.cookie('token', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: false,
            secure: true,
          });

          res.send({ jwt: token });
        }
      })
      .catch((err) => {
        next((err));
      });
  } catch (err) {
    return next(new Unauthorized('Неправильная почта или пароль'));
  }
  return null;
};

// REGISTRATION
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();

    res.status(201).send(result);
  } catch (err) {
    if (err.code === MONGO_DUBLICATE_ERROR_CODE) {
      return next(new Conflict('Пользователь уже существует'));
    }
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
  return null;
};






// module.exports.createUser = async (req, res, next) => {
//   try {
//     const {
//       name, email, password,
//     } = req.body;
//     bcrypt.hash(password, 10)
//       .then((hash) => {
//         User.create({
//           name, email, password: hash,
//         });
//       }).then((result) => {
//         res.status(201).send(result);
//       }).catch((err) => console.log(err));
//   } catch (err) {
//     if (err.code === MONGO_DUBLICATE_ERROR_CODE) {
//       return next(new Conflict('Пользователь уже существует'));
//     }
//     if (err.name === 'ValidationError') {
//       next(new BadRequest('Переданы некорректные данные при создании пользователя'));
//     } else {
//       next(err);
//     }
//   }
//   return null;
// };











// ВЫХОД
module.exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'OK' });
  //     router.post(
  //       "/logout",
  //       (req, res, next) => {
  //         res.clearCookie("jwt");
  //         next();
  //       },
  //       (req, res) => {
  //         console.log(req.cookies);
  //         res.end("finish");
  //       }
  //     );
};

// # возвращает информацию о пользователе (email и имя)
// GET /users/me
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne(req.user);
    if (user) {
      res.send(user);
      console.log(user, 'user')
    } else {
      next(new NotFound('Пользователь по указанному _id не найден'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

// При обновлении данных пользователя с использованием почтового ящика,
// который принадлежит другому юзеру, необходимо возвращать ошибку 409.
module.exports.patchUser = async (req, res, next) => {
  // const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.send(user);
    } else {
      next(new NotFound('Пользователь по указанному _id не найден'));
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при изменении пользователя'));
    }
    if (err.code === MONGO_DUBLICATE_ERROR_CODE) {
      next(new Conflict('Пользователь с таким email уже существует'));
    }
    next(err);
  }
};
