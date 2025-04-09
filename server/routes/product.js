const router = require('express').Router();
const Product = require('../controller/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploadImages = require('../config/cloudinary.config');

router.post(
    '/createProduct',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumb', maxCount: 1 },
    ]),
    Product.createProduct
);
router.put(
    '/updatePr/:pid',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumb', maxCount: 1 },
    ]),
    Product.updatePr
);
router.put(
    '/varriant/:pid',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumb', maxCount: 1 },
    ]),
    Product.addVarriant
);
// Không sử dụng
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
