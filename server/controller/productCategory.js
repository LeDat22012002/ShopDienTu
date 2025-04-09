const ProductCategory = require('../models/productCategory');
const Brand = require('../models/brand');
const AsyncHandler = require('express-async-handler');

const createCt = AsyncHandler(async (req, res) => {
    const { title, image, brand } = req.body;
    // Chuyển đổi chuỗi `brand` thành mảng nếu cần
    if (typeof brand === 'string') {
        brand = brand.split(',').map((id) => id.trim());
    }
    // Kiểm tra xem danh mục đã tồn tại chưa
    const categoryExists = await ProductCategory.findOne({ title });
    if (categoryExists) {
        return res.status(400).json({
            success: false,
            message: 'Danh mục đã tồn tại',
        });
    }
    // Kiểm tra xem tất cả các Brand có tồn tại không
    const existingBrands = await Brand.find({ _id: { $in: brand } });
    if (existingBrands.length !== brand.length) {
        return res.status(400).json({
            success: false,
            message: 'Một hoặc nhiều thương hiệu không tồn tại',
        });
    }

    // Nếu hợp lệ, tạo danh mục mới
    const response = await ProductCategory.create({ title, image, brand });

    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response || 'Không thể tạo danh mục',
    });
});

const getCategorys = AsyncHandler(async (req, res) => {
    const response = await ProductCategory.find().populate('brand');
    return res.status(200).json({
        success: response ? true : false,
        dataCategory: response ? response : ' Cannot get All Category !',
    });
});

const getAllCategorys = AsyncHandler(async (req, res) => {
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
    let queryCommand = ProductCategory.find(qr);

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
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    // Số lượng sp thõa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    try {
        const response = await queryCommand.exec(); // Loại bỏ callback
        const counts = await ProductCategory.find(qr)
            .countDocuments()
            .populate('brand');

        return res.status(200).json({
            success: response ? true : false,
            categorys: response || 'Cannot get all brand !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const updateCategory = AsyncHandler(async (req, res) => {
    const { pcid } = req.params;
    let { title, image, brand } = req.body;

    // Kiểm tra nếu không có ID danh mục
    if (!pcid) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu ID danh mục!',
        });
    }

    // Kiểm tra xem title mới có bị trùng với danh mục khác không
    const existingCategory = await ProductCategory.findOne({
        title: title,
        _id: { $ne: pcid }, // Loại trừ chính danh mục đang cập nhật
    });

    if (existingCategory) {
        return res.status(400).json({
            success: false,
            message: 'Danh mục đã tồn tại, vui lòng chọn tên khác!',
        });
    }

    // Nếu brand được gửi dưới dạng chuỗi, chuyển thành mảng
    if (typeof brand === 'string') {
        brand = brand.split(',').map((id) => id.trim());
    }

    // Kiểm tra tất cả các Brand có tồn tại không
    if (brand && brand.length > 0) {
        const existingBrands = await Brand.find({ _id: { $in: brand } });

        if (existingBrands.length !== brand.length) {
            return res.status(400).json({
                success: false,
                message: 'Một hoặc nhiều thương hiệu không tồn tại!',
            });
        }
    }

    // Cập nhật danh mục
    const response = await ProductCategory.findByIdAndUpdate(
        pcid,
        { title, image, brand }, // Cập nhật title, image, brand
        { new: true }
    );

    return res.status(200).json({
        success: response ? true : false,
        dataCategory: response || 'Không thể cập nhật danh mục!',
    });
});

const deleteCategory = AsyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response
            ? response
            : 'Cannot delete product - category !',
    });
});

module.exports = {
    createCt,
    getCategorys,
    updateCategory,
    deleteCategory,
    getAllCategorys,
};
