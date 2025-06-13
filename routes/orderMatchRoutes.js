const express = require('express');
const router = express.Router();
const orderMatchController = require('../controllers/orderMatchController');

router.post('/', orderMatchController.createOrderMatch);
router.get('/', orderMatchController.getOrderMatches);
router.get('/:id', orderMatchController.getOrderMatchById);

module.exports = router;