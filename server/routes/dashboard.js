const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const DashBoard = require('../controller/dashboard');

router.get(
    '/visits-today',
    [verifyAccessToken, isAdmin],
    DashBoard.getTodayVisits
);
router.get(
    '/visits-30days',
    [verifyAccessToken, isAdmin],
    DashBoard.getLast30DaysVisits
);
router.get(
    '/order-today',
    [verifyAccessToken, isAdmin],
    DashBoard.getOrdersToday
);
router.get(
    '/order-30days',
    [verifyAccessToken, isAdmin],
    DashBoard.getRevenueLast30Days
);
router.get(
    '/revenue-today',
    [verifyAccessToken, isAdmin],
    DashBoard.getRevenueToday
);

module.exports = router;
