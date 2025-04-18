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
const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find();
    return res.status(200).json({
        success: response ? true : false,
        dataOrder: response ? response : 'Can not get All Order !',
    });
});

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find({ orderby: _id });
    return res.status(200).json({
        success: response ? true : false,
        dataOrder: response ? response : 'Can not get All Order !',
    });
});

module.exports = {
    createOrder,
    updateStatusOrder,
    getOrders,
    getUserOrder,
};
