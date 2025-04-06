const blogCategory = require('../controller/blogCategory')
const {verifyAccessToken , isAdmin} = require('../middlewares/verifyToken')
const router = require('express').Router()


router.post('/createBlogCategory' ,[verifyAccessToken , isAdmin], blogCategory.createBct)
router.get('/getAllBlCt', blogCategory.getBlogCategorys)
router.put('/updateBlogCategory/:pbcid' ,[verifyAccessToken , isAdmin], blogCategory.updateBlogCategory)
router.delete('/deleteBlogCategory/:pbcid' ,[verifyAccessToken , isAdmin], blogCategory.deleteBlogCategory)
module.exports = router
