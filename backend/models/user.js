const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const stringWithConstrainedLength = require('./helpers/stringWithConstrainedLength');
const validate = require('./helpers/validate');

const userSchema = new mongoose.Schema(
  {
    name: {
      ...stringWithConstrainedLength,
      default: 'Jacques Cousteau',
    },
    about: {
      ...stringWithConstrainedLength,
      default: 'Sailor, Researcher',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: validate.URL,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: validate.email,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

const rejectInvalidCredentials = () => Promise.reject(new Error('Неправильные почта или пароль'));

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, pass) {
  return this.findOne({ email }).select('+password')
    .then(({ password, ...user }) => {
      if (!user) {
        return rejectInvalidCredentials;
      }

      return bcrypt.compare(pass, password)
        .then((matched) => {
          if (!matched) {
            return rejectInvalidCredentials;
          }

          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
