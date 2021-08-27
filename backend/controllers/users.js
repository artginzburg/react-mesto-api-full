const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const { classes, names } = require('../errors');

const { StatusCodes } = require('../helpers/StatusCodes');
const { messages } = require('../helpers/messages');
const { JWT_SECRET } = require('../helpers/constants');

const {
  NotFoundError, BadRequestError, ConflictError, UnauthorizedError,
} = classes;

const options = {
  runValidators: true,
  new: true,
};

const tokenExpiration = { days: 7 };
tokenExpiration.sec = 60 * 60 * 24 * tokenExpiration.days;
tokenExpiration.ms = 1000 * tokenExpiration.sec;

module.exports.getUsers = (req, res, next) => User.find({})
  .then((data) => res.send({ data }))
  .catch(next);

module.exports.getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((data) => {
    if (!data) {
      throw new NotFoundError();
    }

    res.send({ data });
  })
  .catch((err) => next(err.name === names.cast ? new BadRequestError() : err));

module.exports.findUser = (req, res, next) => User.findById(req.params.id)
  .then((data) => {
    if (!data) {
      throw new NotFoundError();
    }

    res.send({ data });
  })
  .catch((err) => {
    if (err.name === names.cast) {
      throw new BadRequestError();
    }

    next(err);
  })
  .catch(next);

module.exports.createUser = (req, res, next) => bcrypt.hash(req.body.password, 10)
  .then((hash) => User.create({
    email: req.body.email,
    password: hash,
  }))
  .then((dataWithPassword) => {
    const data = dataWithPassword;
    data.password = undefined;
    return res.status(StatusCodes.created).send({ data });
  })
  .catch((err) => {
    if (err.name === names.Mongo && err.code === StatusCodes.mongo) {
      throw new ConflictError();
    }
    if (err.name === names.Validation) {
      throw new BadRequestError();
    }
    next(err);
  })
  .catch(next);

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .then((data) => {
      if (!data) {
        throw new NotFoundError();
      }
      return res.send({ data });
    })
    .catch((err) => {
      if (err.name === names.Validation || err.name === names.Cast) {
        throw new BadRequestError();
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .then((data) => {
      if (!data) {
        throw new NotFoundError();
      }
      return res.send({ data });
    })
    .catch((err) => {
      if (err.name === names.Validation || err.name === names.Cast) {
        throw new BadRequestError();
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        // eslint-disable-next-line no-underscore-dangle
        { _id: user._doc._id }, JWT_SECRET, { expiresIn: tokenExpiration.sec },
      );
      res
        .cookie('jwt', token, {
          maxAge: tokenExpiration.ms,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: messages.ok });
    })
    .catch(() => next(new UnauthorizedError()));
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt').send({ message: messages.ok });
  next();
};
