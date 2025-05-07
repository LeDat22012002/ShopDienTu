const AsyncHandler = require('express-async-handler');
const Order = require('../models/order');
const Visit = require('../models/Visit');

const getOrdersToday = AsyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const count = await Order.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
    });

    return res.status(200).json({
        success: count ? true : false,
        datas: count ? count : 'Someting went wrong !',
    });
});

const getRevenueToday = AsyncHandler(async (req, res) => {
    const now = new Date();

    // Tạo mốc 0h UTC hôm nay
    const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    // Tạo mốc 0h UTC ngày mai
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const result = await Order.aggregate([
        {
            $match: {
                status: 'CONFIRMED',
                createdAt: { $gte: today, $lt: tomorrow },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
            },
        },
    ]);

    return res.json({ totalRevenue: result[0]?.totalRevenue || 0 });
});

const getRevenueLast30Days = AsyncHandler(async (req, res) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const result = await Order.aggregate([
        {
            $match: {
                status: 'CONFIRMED',
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                total: { $sum: '$total' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
        success: result ? true : false,
        datas: result ? result : 'Something went wrong!',
    });
});

const getTodayVisits = AsyncHandler(async (req, res) => {
    const now = new Date();

    // Tạo mốc 0h UTC hôm nay
    const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    // Tạo mốc 0h UTC ngày mai
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const count = await Visit.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
    });

    return res.json({
        success: true,
        data: count,
    });
});

const getLast30DaysVisits = AsyncHandler(async (req, res) => {
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - 30);

    const result = await Visit.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$createdAt',
                    },
                },
                total: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    return res.json({
        success: true,
        datas: result,
    });
});

module.exports = {
    getOrdersToday,
    getRevenueToday,
    getRevenueLast30Days,
    getTodayVisits,
    getLast30DaysVisits,
};
