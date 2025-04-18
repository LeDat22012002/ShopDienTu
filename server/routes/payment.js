const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middlewares/verifyToken');
const PaymentCtrl = require('../controller/payment');

router.post('/momo-create', verifyAccessToken, PaymentCtrl.createMomo);
router.post('/momo-ipn', PaymentCtrl.handleMomoIPN);

module.exports = router;
