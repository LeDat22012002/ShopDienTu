const Order = require('../models/order');
const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const Promotion = require('../models/promotion');

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
        paidAt,
        statusHistory,
    });
    // Nếu có mã khuyến mãi và thanh toán thành công => cập nhật usedCount
    if (newOrder && promotionCode && isPaid) {
        await Promotion.findOneAndUpdate(
            { code: promotionCode },
            { $inc: { usedCount: 1 } },
            { new: true }
        );
    }

    if (newOrder && isPaid) {
        await Promise.all(
            newOrder.products.map(async (item) => {
                const prod = await Product.findById(item.product);
                if (!prod) return;

                if (prod.varriants && prod.varriants.length > 0) {
                    const variantIndex = prod.varriants.findIndex(
                        (v) => v.color === item.color && v.sku === item.sku
                    );
                    if (variantIndex !== -1) {
                        prod.varriants[variantIndex].quantity -= item.count;
                        prod.varriants[variantIndex].sold += item.count;
                        prod.markModified('varriants');
                    }
                } else {
                    prod.quantity -= item.count;
                    prod.sold += item.count;
                }

                await prod.save();
            })
        );
    }

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
    const { status, note } = req.body;

    if (!status) {
        return res
            .status(400)
            .json({ success: false, message: 'Missing status' });
    }

    const order = await Order.findById(oid);
    if (!order) {
        return res
            .status(404)
            .json({ success: false, mess: 'Đơn hàng không tồn tại' });
    }

    const updates = {
        status,
        statusHistory: [
            ...order.statusHistory,
            {
                status,
                updatedAt: new Date(),
                note: note || '',
            },
        ],
    };

    switch (status) {
        case 'CONFIRMED':
            // Giảm kho, tăng sold cho từng sản phẩm/variant
            await Promise.all(
                order.products.map(async (item) => {
                    const prod = await Product.findById(item.product);
                    if (!prod) return;

                    if (prod.varriants && prod.varriants.length > 0) {
                        const variantIndex = prod.varriants.findIndex(
                            (v) => v.color === item.color && v.sku === item.sku
                        );
                        if (variantIndex !== -1) {
                            prod.varriants[variantIndex].quantity -= item.count;
                            prod.varriants[variantIndex].sold += item.count;
                        }
                    } else {
                        prod.quantity -= item.count;
                        prod.sold += item.count;
                    }

                    await prod.save();
                })
            );
            break;

        case 'COMPLETED':
            updates.isDelivered = true;
            updates.deliveredAt = new Date();
            updates.isPaid = true;
            updates.paidAt = new Date();
            break;

        case 'SHIPPING':
            updates.isDelivered = false;
            break;

        case 'CANCELLED':
            // Hoàn kho nếu đơn đã CONFIRMED hoặc SHIPPING
            if (['CONFIRMED', 'SHIPPING'].includes(order.status)) {
                await Promise.all(
                    order.products.map(async (item) => {
                        const prod = await Product.findById(item.product);
                        if (!prod) return;

                        if (prod.variants && prod.variants.length > 0) {
                            const variantIndex = prod.variants.findIndex(
                                (v) =>
                                    v.color === item.color && v.sku === item.sku
                            );
                            if (variantIndex !== -1) {
                                prod.variants[variantIndex].quantity +=
                                    item.count;
                                prod.variants[variantIndex].sold -= item.count;
                            }
                        } else {
                            prod.quantity += item.count;
                            prod.sold -= item.count;
                        }

                        await prod.save();
                    })
                );
            }
            updates.isDelivered = false;
            break;
    }

    const updatedOrder = await Order.findByIdAndUpdate(oid, updates, {
        new: true,
    });

    return res.status(200).json({
        success: true,
        mess: 'Cập nhật trạng thái đơn hàng thành công',
        updatedOrder,
    });
});

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

    let queryObject = {}; //  Lọc theo user hiện tại
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

const canCelOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { oid } = req.params;
    // console.log('dat', _id, oid);
    if (!_id || !oid) throw new Error('Missing inputs');
    const order = await Order.findById(oid);
    if (!order) {
        return res.status(400).json({
            success: false,
            mess: 'order not found',
        });
    }
    if (order.orderby.toString() !== _id) {
        return res.status(400).json({
            success: false,
            mess: 'User does not have the right to cancel this order',
        });
    }
    if (order.status !== 'PENDING' && order.status !== 'COMPLETED') {
        return res.status(400).json({
            success: false,
            mess: 'Something went wrong!',
        });
    }
    const updates = {
        status: 'CANCELLED',
        statusHistory: [
            ...order.statusHistory,
            {
                status: 'CANCELLED',
                updatedAt: new Date(),
                note: 'Đơn hàng đã bị hủy bởi người mua',
            },
        ],
    };
    const response = await Order.findByIdAndUpdate(oid, updates, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? 'Order canceled successfully' : 'Something went wrong',
    });
});

module.exports = {
    createOrder,
    updateStatusOrder,
    getOrders,
    getUserOrder,
    canCelOrder,
};
