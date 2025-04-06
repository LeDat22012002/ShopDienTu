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
};
