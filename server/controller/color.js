const Color = require('../models/color');
const AsyncHandler = require('express-async-handler');

const createColor = AsyncHandler(async (req, res) => {
    const { title, hexCode } = req.body;
    if (!title || !hexCode) throw new Error('Missing inputs');
    const existsColor = await Color.findOne({ title: title });
    if (existsColor) {
        return res.status(400).json({
            success: false,
            mess: 'Color already exists!',
        });
    }

    const response = await Color.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        dataColor: response ? response : 'Cannot create Color!',
        mess: response ? 'Create color successfully!' : 'Something went wrong!',
    });
});
const getAllColors = AsyncHandler(async (req, res) => {
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
                {
                    hexCode: { $regex: queries.q, $options: 'i' },
                },
            ],
        };
    }
    const qr = { ...formatedQueries, ...queryObject };
    let queryCommand = Color.find(qr);

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
        const counts = await Color.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            colors: response ? response : 'Cannot get all color!',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const updateColor = AsyncHandler(async (req, res) => {
    const { clid } = req.params;
    const { title, hexCode } = req.body;
    // Kiểm tra xem title mới có bị trùng với danh mục khác không
    const existingColor = await Color.findOne({
        title: title,
        _id: { $ne: clid }, // Loại trừ chính danh mục đang cập nhật
    });
    if (existingColor) {
        return res.status(400).json({
            success: false,
            mess: 'Color already exists!',
        });
    }

    // Kiểm tra xem title mới có bị trùng với danh mục khác không
    const existingHexCode = await Color.findOne({
        hexCode: hexCode,
        _id: { $ne: clid }, // Loại trừ chính danh mục đang cập nhật
    });
    if (existingHexCode) {
        return res.status(400).json({
            success: false,
            mess: 'HexCode already exists!',
        });
    }
    // Cập nhật danh mục
    const response = await Color.findByIdAndUpdate(clid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        colorUpdated: response ? response : 'Cannot update color!',
        mess: response
            ? 'Update Color successfully !'
            : 'Something went wrong !',
    });
});

const deleteColor = AsyncHandler(async (req, res) => {
    const { clid } = req.params;
    const response = await Color.findByIdAndDelete(clid);
    return res.status(200).json({
        success: response ? true : false,
        mess: response
            ? 'Delete color successfully !'
            : 'Cannot delete color !',
    });
});

module.exports = {
    createColor,
    getAllColors,
    updateColor,
    deleteColor,
};
