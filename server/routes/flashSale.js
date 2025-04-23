const FlashSale = require('../controller/flashSale');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const router = require('express').Router();

// Tạo flash sale - cần admin
router.post(
    '/createFlashSale',
    [verifyAccessToken, isAdmin],
    FlashSale.createFlashSale
);

// Lấy tất cả flash sale (có filter/sort/pagination)
router.get('/getFlashSales', FlashSale.getAllFlashSales);

// Lấy flash sale đang hoạt động (hiện tại)
router.get('/getActiveFlashSales', FlashSale.getActiveFlashSales);

// Cập nhật flash sale - cần admin
router.put(
    '/updateFlashSale/:fsid',
    [verifyAccessToken, isAdmin],
    FlashSale.updateFlashSale
);

// Xoá flash sale - cần admin
router.delete(
    '/deleteFlashSale/:fsid',
    [verifyAccessToken, isAdmin],
    FlashSale.deleteFlashSale
);

module.exports = router;
