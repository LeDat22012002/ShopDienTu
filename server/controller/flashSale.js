const flashSale = require('../models/flashSale');
const FlashSale = require('../models/flashSale');
const AsyncHandler = require('express-async-handler');

// Tạo mới chương trình flash sale
const createFlashSale = AsyncHandler(async (req, res) => {
    const { products, startTime, endTime } = req.body;
    if (!products || !startTime || !endTime) {
        throw new Error('Missing required fields!');
    }

    const response = await FlashSale.create(req.body);
    return res.status(201).json({
        success: response ? true : false,
        flashSale: response || 'Cannot create flash sale!',
        mess: response
            ? 'Created flash sale successfully!'
            : 'Something went wrong',
    });
});

// Lấy tất cả flash sale (có filter, sort, paging)
const getAllFlashSales = AsyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các operators cho đúng cú pháp mongdb
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (macthedEl) => `$${macthedEl}`
    );
    const formatedQueries = JSON.parse(queryString);
    // let colorQueryObject = {};

    let queryObject = {};
    if (queries?.q) {
        delete formatedQueries.q;

        queryObject = {
            $or: [
                {
                    title: { $regex: queries.q, $options: 'i' },
                },
            ],
        };
    }
    const qr = { ...formatedQueries, ...queryObject };
    let queryCommand = FlashSale.find(qr);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    // limit : số oject lấy về 1 lần gọi API
    const page = +req.query.page || 1;
    const limit = +req.query.limit || null;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    // Số lượng sp thõa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    try {
        const response = await queryCommand.exec(); // Loại bỏ callback
        const counts = await FlashSale.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            flashSales: response || 'Cannot get FlashSales !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            mess: err.message,
        });
    }
});

// Cập nhật chương trình flash sale
const updateFlashSale = AsyncHandler(async (req, res) => {
    const { fsid } = req.params;
    const response = await FlashSale.findByIdAndUpdate(fsid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedFlashSale: response || 'Cannot update flash sale!',
        mess: response
            ? 'Update Flash Sale successfully!'
            : 'Something went wrong!',
    });
});

// Xoá chương trình flash sale
const deleteFlashSale = AsyncHandler(async (req, res) => {
    const { fsid } = req.params;
    const response = await FlashSale.findByIdAndDelete(fsid);
    return res.status(200).json({
        success: response ? true : false,
        mess: response
            ? 'Delete flash sale successfully!'
            : 'Cannot delete flash sale!',
    });
});

// Lấy chương trình đang hoạt động (trong thời gian hiện tại)
const getActiveFlashSales = AsyncHandler(async (req, res) => {
    const now = new Date();
    const response = await FlashSale.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        isActive: true,
    }).populate('products.product');

    return res.status(200).json({
        success: true,
        flashSales: response,
    });
});

module.exports = {
    createFlashSale,
    getAllFlashSales,
    updateFlashSale,
    deleteFlashSale,
    getActiveFlashSales,
};
