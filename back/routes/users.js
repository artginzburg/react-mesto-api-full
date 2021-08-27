const router = require('express').Router();

const {
  getUsers,
  findUser,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const { validateObjectId, validateUserInfo, validateUserAvatar } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', getCurrentUser);
router.patch('/me', validateUserInfo, updateUser);

router.get('/:id', validateObjectId, findUser);

router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
