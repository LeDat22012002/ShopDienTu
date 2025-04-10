const productCategory = require('../controller/productCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const router = require('express').Router();
const uploadImages = require('../config/cloudinary.config');
router.post(
    '/createCategory',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([{ name: 'image', maxCount: 1 }]),
    productCategory.createCt
);
router.get('/getAllCt', productCategory.getCategorys);
router.get('/getCategorys', productCategory.getAllCategorys);
router.put(
    '/updateCategory/:pcid',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([{ name: 'image', maxCount: 1 }]),
    productCategory.updateCategory
);
router.delete(
    '/deleteCategory/:pcid',
    [verifyAccessToken, isAdmin],
    productCategory.deleteCategory
);
module.exports = router;
