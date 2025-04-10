const Brand = require('../models/brand');
const AsyncHandler = require('express-async-handler');

const createBrand = AsyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) throw new Error('Missing input');
    // Kiểm tra xem thương hiệu đã tồn tại chưa

    const brandExists = await Brand.findOne({ title: title });
    if (brandExists) {
        return res.status(400).json({
            success: false,
            message: 'Brand already exists!',
        });
    }

    // Nếu chưa tồn tại, tạo mới
    const response = await Brand.create(req.body);
    return res.json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create Brand !',
        mess: response ? 'Create Brand successfully !' : 'Something went wrong',
    });
});

const getBrands = AsyncHandler(async (req, res) => {
    const response = await Brand.find();
    return res.status(200).json({
        success: response ? true : false,
        brands: response ? response : ' Cannot get All Brand !',
    });
});

const getAllBrands = AsyncHandler(async (req, res) => {
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
    let queryCommand = Brand.find(qr);

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
        const counts = await Brand.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            brands: response || 'Cannot get all brand !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const updateBrand = AsyncHandler(async (req, res) => {
    const { brid } = req.params;
    const { title } = req.body;
    // Kiểm tra xem title mới có bị trùng với danh mục khác không
    const existingBrand = await Brand.findOne({
        title: title,
        _id: { $ne: brid }, // Loại trừ chính danh mục đang cập nhật
    });
    if (existingBrand) {
        return res.status(400).json({
            success: false,
            message: 'Brand already exists!',
        });
    }
    // Cập nhật danh mục
    const response = await Brand.findByIdAndUpdate(brid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        dataBrand: response || 'Cannot update brand!',
        mess: response
            ? 'Update Brand successfully !'
            : 'Something went wrong !',
    });
});
const deleteBrand = AsyncHandler(async (req, res) => {
    const { brid } = req.params;
    const response = await Brand.findByIdAndDelete(brid);
    return res.status(200).json({
        success: response ? true : false,
        mess: response
            ? 'Delete brand successfully !'
            : 'Cannot delete Brand !',
    });
});

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
    getAllBrands,
};
