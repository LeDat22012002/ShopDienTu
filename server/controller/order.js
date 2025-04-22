const Order = require('../models/order');

const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const {
        products,
        shippingAddress,
        promotionCode,
        itemsPrice,
        discountAmount,
        totalAmount,
        paymentMethod,
    } = req.body;

    const userId = req.user?._id;

    // Validate đơn giản
    if (!products || !products.length) {
        return res.status(400).json({
            success: false,
            mess: 'Không có sản phẩm nào trong đơn hàng',
        });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone) {
        return res.status(400).json({
            success: false,
            mess: 'Thiếu thông tin người nhận hàng',
        });
    }
    // Thiết lập các trường theo phương thức thanh toán
    const isPaypal = paymentMethod === 'paypal';
    const isPaid = isPaypal;
    const paidAt = isPaypal ? new Date() : null;
    const status = isPaypal ? 'CONFIRMED' : 'PENDING';
    const statusHistory = isPaypal
        ? [
              {
                  status: 'CONFIRMED',
                  note: 'Thanh toán thành công qua PayPal',
              },
          ]
        : [];

    const newOrder = await Order.create({
        products: products.map((item) => ({
            product: item.productId,
            count: item.quantity,
            color: item.color,
            price: item.price,
            sku: item.sku,
            title: item.title,
            thumb: item.thumb, // nếu frontend gửi kèm
        })),
        userReceives: {
            ...shippingAddress,
        },
        paymentMethod,
        itemsPrice,
        total: totalAmount,
        discountAmount: discountAmount || 0,
        promotionCode: promotionCode || null,
        orderby: userId,
        isPaid,
        status,
        statusHistory,
    });

    return res.status(200).json({
        success: newOrder ? true : false,
        createOrdered: newOrder ? newOrder : 'Something went wrong!',
        mess: newOrder
            ? 'Create Order successfully !'
            : 'Something went wrong !',
    });
});

const updateStatusOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) throw new Error('Missing input');
    const response = await Order.findByIdAndUpdate(
        oid,
        { status },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        updatedOrder: response ? response : ' Can not Update Status Order !',
    });
});
// const getOrders = asyncHandler(async (req, res) => {
//     const response = await Order.find();
//     return res.status(200).json({
//         success: response ? true : false,
//         dataOrder: response ? response : 'Can not get All Order !',
//     });
// });

// const getUserOrder = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const response = await Order.find({ orderby: _id });
//     return res.status(200).json({
//         success: response ? true : false,
//         dataOrder: response ? response : 'Can not get All Order !',
//     });
// });
const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
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

    let queryObject = { orderby: _id }; //  Lọc theo user hiện tại
    if (queries?.q) {
        delete formatedQueries.q;

        queryObject = {
            $or: [
                {
                    status: { $regex: queries.q, $options: 'i' },
                },
                {
                    paymentMethod: { $regex: queries.q, $options: 'i' },
                },
            ],
        };
    }
    const qr = { ...formatedQueries, ...queryObject };
    let queryCommand = Order.find(qr);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort('-createdAt');
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
        const counts = await Order.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            dataOrder: response || 'Cannot get order of user !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            mess: err.message,
        });
    }
});

const getOrders = asyncHandler(async (req, res) => {
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

    // // Filtering
    // if (queries?.title)
    //     formatedQueries.title = { $regex: queries.title, $options: 'i' };
    // if (queries?.category)
    //     formatedQueries.category = { $regex: queries.category, $options: 'i' };
    // if (queries?.color) {
    //     delete formatedQueries.color;
    //     const colorArray = queries.color?.split(',');
    //     const colorQuery = colorArray.map((el) => ({
    //         color: { $regex: el, $options: 'i' },
    //     }));
    //     colorQueryObject = { $or: colorQuery };
    // }
    // let queryObject = {};
    // if (queries?.q) {
    //     delete formatedQueries.q;

    //     queryObject = {
    //         $or: [
    //             {
    //                 color: { $regex: queries.q, $options: 'i' },
    //             },
    //             {
    //                 title: { $regex: queries.q, $options: 'i' },
    //             },
    //             {
    //                 category: { $regex: queries.q, $options: 'i' },
    //             },
    //             {
    //                 brand: { $regex: queries.q, $options: 'i' },
    //             },
    //         ],
    //     };
    // }
    const qr = { formatedQueries };
    let queryCommand = Order.find(qr);

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
        const counts = await Order.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            orders: response || 'Cannot get all order !',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = {
    createOrder,
    updateStatusOrder,
    getOrders,
    getUserOrder,
};
