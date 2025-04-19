const asyncHandler = require('express-async-handler');
const { createVnPayPayment } = require('../services/vnpay');
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

// Tạo đơn hàng và thanh toán VNPay
const createVnPay = asyncHandler(async (req, res) => {
    const {
        products,
        shippingAddress,
        promotionCode,
        itemsPrice,
        discountAmount,
        totalAmount,
    } = req.body;

    const userId = req.user._id;
    const paymentOrderId = 'ORDER_' + uuidv4(); // Mã đơn hàng gửi cho VNPay và lưu vào DB

    // Gọi VNPay API để tạo URL thanh toán
    const vnPayRes = await createVnPayPayment({
        amount: totalAmount,
        orderId: paymentOrderId,
        orderInfo: 'Thanh toán đơn hàng tại Shop',
    });

    // Nếu trả về URL thanh toán, lưu đơn hàng vào DB
    if (vnPayRes && vnPayRes.paymentUrl) {
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
            paymentMethod: 'vnpay',
            itemsPrice,
            total: totalAmount,
            discountAmount,
            promotionCode,
            paymentOrderId,
            orderby: userId,
        });

        // Trả về URL thanh toán cho frontend để redirect
        return res.status(200).json({
            success: true,
            payUrl: vnPayRes.paymentUrl,
        });
    } else {
        // Nếu không tạo được thanh toán VNPay
        return res.status(500).json({
            success: false,
            mess: 'Không tạo được thanh toán VNPay',
        });
    }
});

// Xử lý thông báo IPN từ VNPay
const handleVnPayIPN = asyncHandler(async (req, res) => {
    const {
        vnp_ResponseCode,
        vnp_TxnRef, // paymentOrderId bạn gửi lúc tạo thanh toán
        vnp_TransactionNo, // mã giao dịch thực tế bên VNPay
    } = req.body;

    // Kiểm tra thanh toán thành công
    if (vnp_ResponseCode === '00') {
        const order = await Order.findOne({ paymentOrderId: vnp_TxnRef });

        if (!order) {
            return res.status(404).json({ mess: 'Không tìm thấy đơn hàng' });
        }

        // Nếu chưa thanh toán thì mới cập nhật
        if (!order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.status = 'CONFIRMED';
            order.statusHistory.push({
                status: 'CONFIRMED',
                note: `Thanh toán thành công qua VNPay - Mã giao dịch: ${vnp_TransactionNo}`,
            });

            await order.save();
        }
    }

    res.status(200).json({ mess: 'IPN received' });
});

module.exports = {
    createVnPay,
    handleVnPayIPN,
};
