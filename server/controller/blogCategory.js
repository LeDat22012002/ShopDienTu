const BlogCategory = require('../models/blogCategory')
const AsyncHandler = require('express-async-handler')

const createBct = AsyncHandler(async (req, res) => {
    try {
        // Kiểm tra xem danh mục đã tồn tại chưa
        const blogcategoryExists = await BlogCategory.findOne({ title: req.body.title });
        if (blogcategoryExists) {
            return res.status(400).json({
                success: false,
                message: "Danh mục đã tồn tại"
            });
        }

        // Nếu chưa tồn tại, tạo mới
        const response = await BlogCategory.create(req.body);
        return res.json({
            success: true,
            createdBlogcategory: response
        });

    } catch (error) {
        // Xử lý lỗi duplicate key
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Danh mục đã tồn tại, vui lòng chọn tên khác!"
            });
        }

        // Xử lý lỗi khác
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi, vui lòng thử lại sau!"
        });
    }
});


const getBlogCategorys = AsyncHandler(async (req , res) => {
    const response = await BlogCategory.find()
    return res.status(200).json({
        success: response ? true : false,
        dataCategory: response ? response : ' Cannot get All Category !'
    })
})

const updateBlogCategory = AsyncHandler(async (req, res) => {
    const { pbcid } = req.params;
    const { title } = req.body;

    // Kiểm tra nếu không có ID danh mục
    if (!pbcid) {
        return res.status(400).json({
            success: false,
            message: "Thiếu ID danh mục!",
        });
    }

    // Kiểm tra nếu không có dữ liệu cập nhật
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Thiếu tiêu đề danh mục!",
        });
    }
    try {
        // Kiểm tra xem title mới có bị trùng với danh mục khác không
        if (req.body.title) {
            const existingBlogCategory = await BlogCategory.findOne({
                title: req.body.title,
                _id: { $ne: pbcid }, // Loại trừ chính danh mục đang cập nhật
            });

            if (existingBlogCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Danh mục đã tồn tại, vui lòng chọn tên khác!",
                });
            }
        }

        // Cập nhật danh mục
        const response = await BlogCategory.findByIdAndUpdate(pbcid, req.body, {
            new: true,
        });

        return res.status(200).json({
            success: response ? true : false,
            dataBlogCategory: response || "Cannot update blog-category!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi, vui lòng thử lại sau!",
        });
    }
});

const deleteBlogCategory = AsyncHandler(async(req ,res) => {
    const { pbcid } = req.params;
    const response = await BlogCategory.findByIdAndDelete(pbcid)
    return res.status(200).json({
        success : response ? true : false,
        deletedBlogCategory: response ? response : 'Cannot delete blog - category !'
    })
})

module.exports = {
    createBct,
    getBlogCategorys,
    updateBlogCategory,
    deleteBlogCategory
}