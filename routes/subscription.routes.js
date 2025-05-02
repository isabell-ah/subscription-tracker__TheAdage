const {
  createSubscription,
  getSubscriptions,
} = require('../controllers/subscription.controller');
const authorize = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.send({ title: 'Hey hey hey whats happeneing' });
});
router.get('/:id', (req, res) => {
  res.send({ title: 'Get subscription details' });
});
router.post('/', authorize, createSubscription);
router.put('/:put', (req, res) => {
  res.send({ title: 'Update subscriptions' });
});
router.delete('/:id', (req, res) => {
  res.send({ title: 'Delete a subscription' });
});
router.get('/user/:id', authorize, getSubscriptions);
router.put('/:id/cancel', (req, res) => {
  res.send({ title: 'Cancel subscriptions' });
});
router.get('/upcoming-renewals', (req, res) => {
  res.send({ title: 'Get upcming renewals' });
});
module.exports = router;
