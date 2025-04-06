const Brand = require('../models/brand');
const AsyncHandler = require('express-async-handler');

const createBrand = AsyncHandler(async (req, res) => {
    // Kiểm tra xem thương hiệu đã tồn tại chưa
    const brandExists = await Brand.findOne({ title: req.body.title });
    if (brandExists) {
        return res.status(400).json({
            success: false,
            message: 'Thương hiệu đã tồn tại',
        });
    }

    // Nếu chưa tồn tại, tạo mới
    const response = await Brand.create(req.body);
    return res.json({
        success: true,
        createdBrand: response,
    });
});

const getBrands = AsyncHandler(async (req, res) => {
    const response = await Brand.find();
    return res.status(200).json({
        success: response ? true : false,
        dataBrands: response ? response : ' Cannot get All Brand !',
    });
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
            message: 'Brand đã tồn tại, vui lòng chọn tên khác!',
        });
    }
    // Cập nhật danh mục
    const response = await Brand.findByIdAndUpdate(brid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        dataBrand: response || 'Cannot update brand!',
    });
});
const deleteBrand = AsyncHandler(async (req, res) => {
    const { brid } = req.params;
    const response = await Brand.findByIdAndDelete(brid);
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete Brand !',
    });
});

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
};
