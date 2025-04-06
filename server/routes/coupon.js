const router = require('express').Router()
const {verifyAccessToken , isAdmin} = require('../middlewares/verifyToken')
const couponController = require('../controller/coupon')

router.post('/createCoupon', [verifyAccessToken , isAdmin], couponController.createCoupon)
router.put('/updateCoupon/:cid', [verifyAccessToken , isAdmin], couponController.updateCoupon)
router.get('/getAllCoupon', couponController.getCoupons)
// router.get('/getDetailsBlog/:bid', blogController.getDetailsBlog)
router.delete('/deleteCoupon/:cid',[verifyAccessToken , isAdmin], couponController.deleteCoupon)
module.exports = router