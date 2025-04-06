const Brand = require('../controller/brand')
const {verifyAccessToken , isAdmin} = require('../middlewares/verifyToken')
const router = require('express').Router()


router.post('/createBrand' ,[verifyAccessToken , isAdmin], Brand.createBrand)
router.get('/getAllBrand', Brand.getBrands)
router.put('/updateBrand/:brid' ,[verifyAccessToken , isAdmin], Brand.updateBrand)
router.delete('/deleteBrand/:brid' ,[verifyAccessToken , isAdmin], Brand.deleteBrand)
module.exports = router
