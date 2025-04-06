const router = require('express').Router();
const Product = require('../controller/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploadImages = require('../config/cloudinary.config');

router.post(
    '/createProduct',
    [verifyAccessToken, isAdmin],
    Product.createProduct
);
router.put('/updatePr/:pid', [verifyAccessToken, isAdmin], Product.updatePr);
router.put(
    '/uploadImg/:pid',
    [verifyAccessToken, isAdmin],
    uploadImages.array('images', 10),
    Product.uploadImages
);
router.delete('/deletePr/:pid', [verifyAccessToken, isAdmin], Product.deletePr);
router.get('/detailsPr/:pid', Product.getDetailsPr);
router.get('/getAllPrs', Product.getAllPrs);
router.put('/ratings', verifyAccessToken, Product.ratings);

module.exports = router;
