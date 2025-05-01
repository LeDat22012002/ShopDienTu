const Blog = require('../models/blog');
const AsyncHandler = require('express-async-handler');

const createNewblog = AsyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    const image = req?.files?.image[0]?.path;
    if (!title || !description || !category) throw new Error('Missing inputs');

    // Kiểm tra xem blog đã tồn tại chưa
    const blogExists = await Blog.findOne({ title: req.body.title });
    if (blogExists) {
        return res.status(400).json({
            success: false,
            mess: 'Tên bài viết đã tồn tại',
        });
    }
    if (image) req.body.image = image;
    // Nếu chưa tồn tại, tạo mới
    const response = await Blog.create(req.body);
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot new blog !',
        mess: response ? 'Create Blog successfully!' : 'Something went wrong!',
    });
});

const updateBlog = AsyncHandler(async (req, res) => {
    const { bid } = req.params;

    const files = req?.files;
    if (files?.image) {
        req.body.image = files?.image[0]?.path;
    }
    let { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error('Missing inputs');
    // Kiểm tra xem title mới có bị trùng với danh mục khác không

    const existingBlog = await Blog.findOne({
        title: req.body.title,
        _id: { $ne: bid }, // Loại trừ chính danh mục đang cập nhật
    });

    if (existingBlog) {
        return res.status(400).json({
            success: false,
            mess: 'Tên bài viết đã tồn tại, vui lòng chọn tên khác!',
        });
    }

    // Cập nhật bài viết
    const response = await Blog.findByIdAndUpdate(bid, req.body, {
        new: true,
    });

    return res.status(200).json({
        success: response ? true : false,
        dataBlog: response ? response : 'Cannot update blog-category!',
        mess: response ? 'Update Blog successfully!' : 'Something went wrong!',
    });
});

// const getBlogs = AsyncHandler(async (req, res) => {
//     const response = await Blog.find();
//     return res.status(200).json({
//         success: response ? true : false,
//         dataBlogs: response ? response : 'Cannot get All Blog !',
//     });
// });
const getBlogs = AsyncHandler(async (req, res) => {
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
                    description: { $regex: queries.q, $options: 'i' },
                },
            ],
        };
    }
    const qr = { ...formatedQueries, ...queryObject };
    let queryCommand = Blog.find(qr)
        .populate('likes', 'name')
        .populate('dislikes', 'name');

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
        const counts = await Blog.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            blogs: response || 'Cannot get Blogs !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            mess: err.message,
        });
    }
});

const likeBlog = AsyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing input');
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes.find((el) => el.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    }
    const isLiked = blog?.likes.find((el) => el.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { likes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    }
});

const dislikeBlog = AsyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing input');
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog?.likes.find((el) => el.toString() === _id);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { likes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    }
    const isDisliked = blog?.dislikes.find((el) => el.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $pull: { dislikes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            { $push: { dislikes: _id } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    }
});

const getDetailsBlog = AsyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndUpdate(
        bid,
        { $inc: { numberViews: 1 } },
        { new: true }
    )
        .populate('likes', 'name')
        .populate('dislikes', 'name');
    return res.status(200).json({
        success: blog ? true : false,
        rs: blog,
    });
});

const deleteBlog = AsyncHandler(async (req, res) => {
    const { bid } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: deletedBlog ? true : false,
        rs: deletedBlog,
        mess: ' Delete Blog successfully !',
    });
});

const uploadImages = AsyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) throw new Error('Missing inputs');
    const response = await Blog.findByIdAndUpdate(
        bid,
        { image: req.file.path },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        productBlog: response ? response : 'Can not add Images blog !',
    });
});

module.exports = {
    createNewblog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getDetailsBlog,
    deleteBlog,
    uploadImages,
};
