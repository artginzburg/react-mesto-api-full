require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { createUser, login, logout } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateRegister, validateLogin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');

const { NotFoundError } = require('./errors/classes');

const { StatusCodes } = require('./helpers/StatusCodes');
const { messages } = require('./helpers/messages');

const { PORT = 3000, HOST = 'localhost' } = process.env;

const app = express();

const corsWhitelist = [
  'https://m.e.s.t.o.nomoredomains.rocks',
  'https://api.m.e.s.t.o.nomoredomains.rocks',
  'https://localhost:3000',
];

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // in 15m...
    max: 100, // requests per IP.
  }),
  helmet(),
  cors({
    credentials: true,
    origin(origin, callback) {
      if (corsWhitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

app.options('*', cors());

app.use(
  cookieParser(),
  express.json(),
);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт (или нет)');
  }, 0);
});

app.post('/signup', validateRegister, createUser);
app.post('/signin', validateLogin, login);
app.delete('/signout', logout);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError(messages.notFound);
});

app.use(errorLogger);

app.use(
  errors(),
  (err, req, res, next) => {
    const {
      statusCode = StatusCodes.internal,
      message = messages.internal,
    } = err;

    res.status(statusCode).send({ message });
    next();
  },
);

app.listen(PORT, () => console.log(`API listening on http://${HOST}:${PORT}`));
