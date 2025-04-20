const asyncHandler = require('express-async-handler');
const { createMomoPayment } = require('../services/momo');
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

const createMomo = asyncHandler(async (req, res) => {
    const {
        products,
        shippingAddress,
        promotionCode,
        itemsPrice,
        discountAmount,
        totalAmount,
    } = req.body;

    const userId = req.user._id;
    const tempOrderId = 'ORDER_' + uuidv4();

    // Gọi Momo trước để tạo payUrl
    const momoRes = await createMomoPayment({
        amount: totalAmount,
        orderId: tempOrderId,
        orderInfo: 'Thanh toán đơn hàng tại Shop',
    });

    if (!momoRes.payUrl) {
        return res.status(500).json({
            success: false,
            mess: 'Không tạo được thanh toán Momo',
        });
    }

    // Nếu có payUrl mới tạo đơn hàng PENDING
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
        paymentOrderId: tempOrderId,
        status: 'PENDING',
        statusHistory: [
            {
                status: 'PENDING',
                note: 'Đơn hàng được tạo, chờ thanh toán Momo',
            },
        ],
    });
    //  Tự động xóa nếu không thanh toán sau 1 phút
    setTimeout(async () => {
        const stillPending = await Order.findOne({
            paymentOrderId: tempOrderId,
            status: 'PENDING',
        });
        if (stillPending) {
            await Order.deleteOne({ paymentOrderId: tempOrderId });
            // console.log(`Đơn hàng ${tempOrderId} quá thời gian, đã xóa.`);
        }
    }, 60 * 2000); // 2 phút

    return res.status(200).json({
        success: true,
        payUrl: momoRes.payUrl,
    });
});

const handleMomoIPN = asyncHandler(async (req, res) => {
    const { orderId, resultCode } = req.body;
    // console.log('dat', orderId, resultCode);
    if (resultCode === 0) {
        await Order.findOneAndUpdate(
            { paymentOrderId: orderId },
            {
                isPaid: true,
                paidAt: new Date(),
                status: 'CONFIRMED',
                $push: {
                    statusHistory: {
                        status: 'CONFIRMED',
                        note: 'Thanh toán thành công qua Momo',
                    },
                },
            }
        );
    } else {
        await Order.deleteOne({ paymentOrderId: orderId });
    }

    res.status(200).json({ mess: 'IPN received' });
});

module.exports = {
    createMomo,
    handleMomoIPN,
};
