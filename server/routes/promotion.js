const router = require('express').Router();
const PromoCtrl = require('../controller/promotion');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post(
    '/createPromotion',
    [verifyAccessToken, isAdmin],
    PromoCtrl.createPromotion
);
router.put(
    '/updatePromotion/prid:',
    [verifyAccessToken, isAdmin],
    PromoCtrl.updatePromotion
);
router.delete(
    '/deletePromotion/:prid',
    [verifyAccessToken, isAdmin],
    PromoCtrl.deletePromotion
);

router.get('/allPromotion', PromoCtrl.getAllPromotions);
router.get('/code/:code', PromoCtrl.getPromotionByCode);

// API dành cho khách hàng dùng mã giảm giá
router.post('/applyPromotion', verifyAccessToken, PromoCtrl.applyPromotion);

module.exports = router;
