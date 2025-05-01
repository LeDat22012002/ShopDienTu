const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const blogController = require('../controller/blog');
const uploadImages = require('../config/cloudinary.config');

router.post(
    '/createBlog',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([{ name: 'image', maxCount: 1 }]),
    blogController.createNewblog
);
router.put(
    '/updateBlog/:bid',
    [verifyAccessToken, isAdmin],
    uploadImages.fields([{ name: 'image', maxCount: 1 }]),
    blogController.updateBlog
);
router.put('/likes/:bid', [verifyAccessToken], blogController.likeBlog);
router.put('/dislike/:bid', [verifyAccessToken], blogController.dislikeBlog);
router.get('/getAllBlog', blogController.getBlogs);
router.get('/getDetailsBlog/:bid', blogController.getDetailsBlog);
router.delete(
    '/deleteBlog/:bid',
    [verifyAccessToken, isAdmin],
    blogController.deleteBlog
);
router.put(
    '/uploadImg/:bid',
    [verifyAccessToken, isAdmin],
    uploadImages.single('image'),
    blogController.uploadImages
);
module.exports = router;
