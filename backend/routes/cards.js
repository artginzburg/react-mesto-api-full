const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
} = require('../controllers/cards');
const { validateCard, validateObjectId } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCard, createCard);

router.delete('/:id', validateObjectId, deleteCard);

router.put('/:id/likes', validateObjectId, likeCard);
router.delete('/:id/likes', validateObjectId, unLikeCard);

module.exports = router;
