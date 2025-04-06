const productCategory = require('../controller/productCategory')
const {verifyAccessToken , isAdmin} = require('../middlewares/verifyToken')
const router = require('express').Router()


router.post('/createCategory' ,[verifyAccessToken , isAdmin], productCategory.createCt)
router.get('/getAllCt', productCategory.getCategorys)
router.put('/updateCategory/:pcid' ,[verifyAccessToken , isAdmin], productCategory.updateCategory)
router.delete('/deleteCategory/:pcid' ,[verifyAccessToken , isAdmin], productCategory.deleteCategory)
module.exports = router
