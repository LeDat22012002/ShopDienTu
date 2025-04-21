const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middlewares/verifyToken'); // Middleware kiểm tra token
const paymentController = require('../controller/paymentZalopay');

// Tạo đơn ZaloPay, bảo vệ bằng access token
router.post(
    '/zalopay-create',
    verifyAccessToken,
    paymentController.createZaloPayServices
);

// Callback từ ZaloPay, không cần token bảo vệ
router.post('/zalopay-callback', paymentController.zaloPayCallback);

module.exports = router;
