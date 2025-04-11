const Color = require('../controller/color');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const router = require('express').Router();

router.post('/createColor', [verifyAccessToken, isAdmin], Color.createColor);
router.get('/colors', Color.getAllColors);
router.put(
    '/updateColor/:clid',
    [verifyAccessToken, isAdmin],
    Color.updateColor
);

router.delete(
    '/deleteColor/:clid',
    [verifyAccessToken, isAdmin],
    Color.deleteColor
);
module.exports = router;
