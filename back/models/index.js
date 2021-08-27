const mongoose = require('mongoose');

const User = require('./user');
const Card = require('./card');

const { HOST = 'localhost' } = process.env;

mongoose.connect(`mongodb://${HOST}:27017/mestodb`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

module.exports = {
  User,
  Card,
};
