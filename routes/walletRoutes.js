const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.post('/', walletController.createWallet);
router.get('/', walletController.getWallets);
router.get('/user/:userId', walletController.getUserWallets);

module.exports = router;