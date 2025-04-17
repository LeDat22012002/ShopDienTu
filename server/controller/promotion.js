const Promotion = require('../models/promotion');
const asyncHandler = require('express-async-handler');

const createPromotion = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, startDate, endDate } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate)
        throw new Error('Missing required fields');

    const existing = await Promotion.findOne({ code });
    if (existing)
        return res
            .status(400)
            .json({ success: false, mess: 'Code already exists' });

    const newPromo = await Promotion.create(req.body);
    return res.status(200).json({
        success: newPromo ? true : false,
        mess: newPromo
            ? 'Created promotion successfully!'
            : 'Something went wrong!',
        data: newPromo ? newPromo : ' Something went wrong!',
    });
});

// const getAllPromotions = asyncHandler(async (req, res) => {
//     const promos = await Promotion.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: promos });
// });
const getAllPromotions = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    // Format các operators MongoDB
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    const formatedQueries = JSON.parse(queryString);

    // Tìm kiếm theo description hoặc code nếu có query q
    let searchQuery = {};
    if (queries.q) {
        delete formatedQueries.q;
        searchQuery = {
            $or: [
                { code: { $regex: queries.q, $options: 'i' } },
                { description: { $regex: queries.q, $options: 'i' } },
            ],
        };
    }

    const finalQuery = { ...formatedQueries, ...searchQuery };

    let queryCommand = Promotion.find(finalQuery);

    // Sắp xếp
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort({ createdAt: -1 }); // mặc định mới nhất trước
    }

    // Giới hạn fields
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Phân trang
    const page = +req.query.page;
    const limit = +req.query.limit;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    try {
        const promos = await queryCommand.exec();
        const counts = await Promotion.find(finalQuery).countDocuments();

        res.status(200).json({
            success: true,
            promotions: promos,
            counts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const getPromotionByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const promo = await Promotion.findOne({ code });
    if (!promo)
        return res.status(404).json({ success: false, mess: 'Not found' });

    res.status(200).json({
        success: promo ? true : false,
        data: promo ? promo : 'Something went wrong!',
    });
});

const updatePromotion = asyncHandler(async (req, res) => {
    const { prid } = req.params;
    const updated = await Promotion.findByIdAndUpdate(prid, req.body, {
        new: true,
    });
    if (!updated)
        return res.status(404).json({ success: false, mess: 'Not found' });

    res.status(200).json({
        success: true,
        mess: 'Updated successfully',
        data: updated,
    });
});

const deletePromotion = asyncHandler(async (req, res) => {
    const { prid } = req.params;
    const deleted = await Promotion.findByIdAndDelete(prid);
    if (!deleted)
        return res.status(404).json({ success: false, mess: 'Not found' });

    res.status(200).json({ success: true, mess: 'Deleted successfully' });
});

const applyPromotion = asyncHandler(async (req, res) => {
    const { code, orderValue } = req.body;
    const promo = await Promotion.findOne({ code });

    if (!promo)
        return res.status(404).json({ success: false, mess: 'Invalid code' });

    const now = new Date();
    if (promo.startDate > now || promo.endDate < now)
        return res
            .status(400)
            .json({ success: false, mess: 'Code expired or not active' });

    if (promo.usageLimit !== 0 && promo.usedCount >= promo.usageLimit)
        return res
            .status(400)
            .json({ success: false, mess: 'Usage limit exceeded' });

    if (orderValue < promo.minOrderValue)
        return res
            .status(400)
            .json({ success: false, mess: 'Order value too low' });

    let discountAmount = 0;
    if (promo.discountType === 'percent') {
        discountAmount = (promo.discountValue / 100) * orderValue;
    } else {
        discountAmount = promo.discountValue;
    }

    res.status(200).json({
        success: true,
        discountAmount,
        finalPrice: orderValue - discountAmount,
        mess: 'Promotion applied',
    });
});

module.exports = {
    createPromotion,
    getAllPromotions,
    getPromotionByCode,
    updatePromotion,
    deletePromotion,
    applyPromotion,
};
