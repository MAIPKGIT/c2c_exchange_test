const express = require('express');
const router = express.Router();
const cryptoTransactionController = require('../controllers/cryptoTransactionController');

router.post('/', cryptoTransactionController.createCryptoTransaction);
router.get('/', cryptoTransactionController.getCryptoTransactions);
router.get('/:id', cryptoTransactionController.getCryptoTransactionById);
router.post('/transfer-external', cryptoTransactionController.transferExternalCrypto);

module.exports = router;