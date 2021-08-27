const { NODE_ENV, JWT_SECRET } = process.env;

const constants = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-dev-secret',
};

module.exports = constants;
