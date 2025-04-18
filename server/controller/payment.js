const asyncHandler = require('express-async-handler');
const { createMomoPayment } = require('../services/momo');
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

exports.createMomo = asyncHandler(async (req, res) => {
    const {
        products,
        shippingAddress,
        promotionCode,
        itemsPrice,
        discountAmount,
        totalAmount,
    } = req.body;

    const userId = req.user._id;
    const orderId = 'ORDER_' + uuidv4();

    // Tạo đơn PENDING trước
    const order = await Order.create({
        products: products.map((item) => ({
            product: item.productId,
            count: item.quantity,
            color: item.color,
            price: item.price,
            sku: item.sku,
            title: item.title,
            thumb: item.thumb,
        })),
        userReceives: { ...shippingAddress },
        paymentMethod: 'momo',
        itemsPrice,
        total: totalAmount,
        discountAmount,
        promotionCode,
        orderby: userId,
    });

    const momoRes = await createMomoPayment({
        amount: totalAmount,
        orderId: order._id.toString(),
        orderInfo: 'Thanh toán đơn hàng tại Shop',
    });

    if (momoRes.payUrl) {
        return res.status(200).json({
            success: true,
            payUrl: momoRes.payUrl,
        });
    } else {
        return res.status(500).json({
            success: false,
            mess: 'Không tạo được thanh toán Momo',
        });
    }
});

exports.handleMomoIPN = asyncHandler(async (req, res) => {
    const { orderId, resultCode } = req.body;

    if (resultCode === 0) {
        // Cập nhật đơn hàng đã thanh toán
        await Order.findByIdAndUpdate(orderId, {
            isPaid: true,
            paidAt: new Date(),
            status: 'CONFIRMED',
            $push: {
                statusHistory: {
                    status: 'CONFIRMED',
                    note: 'Thanh toán thành công qua Momo',
                },
            },
        });
    }

    res.status(200).json({ message: 'IPN received' });
});
