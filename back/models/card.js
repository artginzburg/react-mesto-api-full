const mongoose = require('mongoose');

const stringWithConstrainedLength = require('./helpers/stringWithConstrainedLength');
const validate = require('./helpers/validate');

const refUserId = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
};

const cardSchema = new mongoose.Schema(
  {
    name: {
      ...stringWithConstrainedLength,
      required: true,
    },
    link: {
      type: String,
      required: true,
      validate: validate.URL,
    },
    owner: {
      ...refUserId,
      required: true,
    },
    likes: [
      {
        ...refUserId,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false },
);

const Card = mongoose.model('card', cardSchema);

module.exports = Card;
