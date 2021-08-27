const validator = require('validator');

const validate = {
  URL: {
    validator: (link) => validator.isURL(link, { require_protocol: true }),
    message: 'Не похоже на ссылку',
  },
  email: {
    validator: validator.isEmail,
    message: 'Что-то не так с почтовым адресом',
  },
};

module.exports = validate;
