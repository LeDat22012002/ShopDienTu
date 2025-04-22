const Order = require('../controller/order');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const router = require('express').Router();

router.post('/createOrder', [verifyAccessToken], Order.createOrder);
router.put(
    '/updateStatus/:oid',
    [verifyAccessToken, isAdmin],
    Order.updateStatusOrder
);
router.get('/getAllOrder', [verifyAccessToken, isAdmin], Order.getOrders);
router.get('/getUserOrder', [verifyAccessToken], Order.getUserOrder);

module.exports = router;
