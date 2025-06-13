const express = require('express');
const router = express.Router();
const fiatTransactionController = require('../controllers/fiatTransactionController');

router.post('/', fiatTransactionController.createFiatTransaction);
router.get('/', fiatTransactionController.getFiatTransactions);
router.get('/:id', fiatTransactionController.getFiatTransactionById);
router.post('/deposit', fiatTransactionController.depositFiat);
router.post('/withdraw', fiatTransactionController.withdrawFiat);

module.exports = router;