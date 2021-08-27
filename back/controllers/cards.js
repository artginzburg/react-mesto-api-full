const { Card } = require('../models');

const { classes, names } = require('../errors');

const { StatusCodes } = require('../helpers/StatusCodes');

const {
  NotFoundError, BadRequestError, ForbiddenError,
} = classes;

const options = { new: true };
const defaultPopulation = ['owner', 'likes'];

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(StatusCodes.created).send({ data }))
    .catch((err) => next(err.name === names.Validation ? new BadRequestError() : err));
};

module.exports.getCards = (req, res, next) => Card.find({})
  .populate(defaultPopulation)
  .then((data) => res.send({ data }))
  .catch(next);

module.exports.deleteCard = async (req, res, next) => {
  let card;
  try {
    card = await Card.findById(req.params.id)
      .orFail(new NotFoundError());
  } catch (error) {
    return next(error);
  }

  return card.owner.toString() === req.user._id
    ? card
      .delete()
      .then((data) => res.send({ data }))
      .catch((err) => next(err.name === names.Cast ? new BadRequestError() : err))
    : next(new ForbiddenError());
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  options,
)
  .populate(defaultPopulation)
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

module.exports.unLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  options,
)
  .populate(defaultPopulation)
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
