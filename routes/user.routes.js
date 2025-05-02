const { getUsers, getUser } = require('../controllers/user.controller');
const authorize = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.get('/', getUsers);
router.get('/:id', authorize, getUser);
router.post('/', (req, res) => {
  res, send({ title: 'Create new user' });
});
router.put('/:id', (req, res) => {
  res, send({ title: 'Get user details' });
});
router.delete('/:id', (req, res) => {
  res, send({ title: 'delete user' });
});
module.exports = router;
