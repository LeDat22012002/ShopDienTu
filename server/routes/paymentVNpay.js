const VNpay = require('../controller/paymentVNpay');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const router = require('express').Router();

// Route tạo thanh toán VNPay
router.post('/createVnPay', [verifyAccessToken], VNpay.createVnPay);

// Route nhận thông báo IPN từ VNPay
router.post('/vnpay-ipn', VNpay.handleVnPayIPN);

module.exports = router;
