const Product = require('../models/product');
const Category = require('../models/productCategory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const makeSKU = require('uniqid');

const createProduct = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        category,
        quantity,
        brand,
        color,
        shortDescription,
    } = req.body;
    const thumb = req?.files?.thumb[0]?.path;
    const images = req?.files?.images?.map((el) => el.path);
    if (
        !title ||
        !description ||
        !category ||
        !price ||
        !quantity ||
        !brand ||
        !color ||
        !shortDescription
    )
        throw new Error('Missing inputs');
    // Kiểm tra xem title đã tồn tại chưa
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
        return res
            .status(400)
            .json({ success: false, mess: 'Product title already exists' });
    }
    // Kiểm tra xem category có tồn tại không
    const existingCategory = await Category.findOne({
        title: new RegExp(`^${category}$`, 'i'),
    });
    if (!existingCategory) {
        return res
            .status(400)
            .json({ success: false, mess: 'Invalid category' });
    }

    // Tạo slug từ title nếu có
    if (title) req.body.slug = slugify(title);
    if (thumb) req.body.thumb = thumb;
    if (images) req.body.images = images;
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Can not new product !',
        mess: newProduct
            ? 'Create successful product !'
            : 'Someting went wrong! ',
    });
});

const getDetailsPr = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar',
        },
    });

    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Can not product !',
    });
});

const getAllPrs = asyncHandler(async (req, res) => {
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
    let colorQueryObject = {};

    // Filtering
    if (queries?.title)
        formatedQueries.title = { $regex: queries.title, $options: 'i' };
    if (queries?.category)
        formatedQueries.category = { $regex: queries.category, $options: 'i' };
    if (queries?.color) {
        delete formatedQueries.color;
        const colorArray = queries.color?.split(',');
        const colorQuery = colorArray.map((el) => ({
            color: { $regex: el, $options: 'i' },
        }));
        colorQueryObject = { $or: colorQuery };
    }
    let queryObject = {};
    if (queries?.q) {
        delete formatedQueries.q;

        queryObject = {
            $or: [
                {
                    color: { $regex: queries.q, $options: 'i' },
                },
                {
                    title: { $regex: queries.q, $options: 'i' },
                },
                {
                    category: { $regex: queries.q, $options: 'i' },
                },
                {
                    brand: { $regex: queries.q, $options: 'i' },
                },
            ],
        };
    }
    const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject };
    let queryCommand = Product.find(qr);

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
        const counts = await Product.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            products: response || 'Cannot get all product !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const updatePr = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const files = req?.files;
    if (files?.thumb) {
        req.body.thumb = files?.thumb[0]?.path;
    }
    if (files?.images) {
        req.body.images = files?.images?.map((el) => el.path);
    }
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const updatedPr = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: updatedPr ? true : false,
        productData: updatedPr ? updatedPr : 'Can not update product !',
        mess: updatedPr
            ? 'Product update successful! '
            : 'Can not update product !',
    });
});

const deletePr = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const deletedPr = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedPr ? true : false,
        productData: deletedPr ? deletedPr : 'Can not delete product !',
        mess: deletedPr
            ? 'Delete product successfully !'
            : 'Can not delete product !',
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
    if (!star || !pid) throw new Error(' Missing inputs');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(
        (el) => el.postedBy.toString() === _id
    );
    if (alreadyRating) {
        // update star & comment
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                    'ratings.$.updatedAt': updatedAt,
                },
            },
            { new: true }
        );
    } else {
        // add star & comment
        await Product.findByIdAndUpdate(
            pid,
            {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: _id,
                        updatedAt,
                    },
                },
            },
            { new: true }
        );
    }

    // Sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce(
        (sum, el) => sum + +el.star,
        0
    );
    updatedProduct.totalRatings =
        Math.round((sumRatings * 10) / ratingCount) / 10;

    await updatedProduct.save();

    return res.status(200).json({
        status: true,
        updatedProduct,
    });
});

const uploadImages = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.files) throw new Error('Missing inputs');
    const response = await Product.findByIdAndUpdate(
        pid,
        { $push: { images: { $each: req.files.map((el) => el.path) } } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        productData: response ? response : 'Can not add Images product !',
    });
});

const addVarriant = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { title, price, color } = req.body;
    const thumb = req?.files?.thumb[0]?.path;
    const images = req?.files?.images?.map((el) => el.path);
    if (!title || !price || !color) throw new Error('Missing inputs');
    // Tạo slug từ title nếu có
    // if (thumb) req.body.thumb = thumb;
    // if (images) req.body.images = images;
    const response = await Product.findByIdAndUpdate(
        pid,
        {
            $push: {
                varriants: {
                    color,
                    price,
                    title,
                    thumb,
                    images,
                    sku: makeSKU().toUpperCase(),
                },
            },
        },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        mess: response
            ? 'Add varriant successfully !'
            : 'Something went wrong !',
        dataVarriant: response ? response : 'Something went wrong !',
    });
});

module.exports = {
    createProduct,
    getDetailsPr,
    getAllPrs,
    updatePr,
    deletePr,
    ratings,
    uploadImages,
    addVarriant,
};
