const { createZaloPayOrder } = require('../services/zalopay');
const Order = require('../models/order');
const asyncHandler = require('express-async-handler');
const CryptoJS = require('crypto-js');
const Product = require('../models/product');
const Promotion = require('../models/promotion');
// [POST] /api/payment/zalopay-create
const createZaloPayServices = asyncHandler(async (req, res) => {
    try {
        const zaloOrder = await createZaloPayOrder(req.body);
        res.status(200).json(zaloOrder);
    } catch (err) {
        res.status(500).json({
            error: err.message || 'Đã có lỗi xảy ra khi tạo đơn ZaloPay',
        });
    }
});
const config = {
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf', // Key2 từ ZaloPay
};
// [POST] /api/payment/zalopay-callback
// const zaloPayCallback = asyncHandler(async (req, res) => {
//     const callbackData = req.body;
//     console.log('Callback received:', callbackData); // Log dữ liệu để kiểm tra

//     try {
//         // Kiểm tra xem trường 'data' trong callback có tồn tại không
//         if (!callbackData.data || !callbackData.mac) {
//             return res.status(400).json({
//                 return_code: -1,
//                 message: 'Invalid data or MAC missing',
//             });
//         }

//         // Parse dữ liệu JSON bên trong 'data'
//         const data = JSON.parse(callbackData.data);
//         console.log('ZaloPay callback parsed:', data);

//         const config = {
//             key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf', // Key2 từ ZaloPay
//         };

//         // Đảm bảo trường 'item' có giá trị hợp lệ
//         const items = data.item && data.item !== 'undefined' ? data.item : '[]'; // Nếu 'item' không hợp lệ, gán giá trị mảng rỗng

//         // Tạo chuỗi xác thực MAC, đảm bảo thứ tự đúng và không thiếu | giữa các trường
//         const status = data.status !== undefined ? data.status : 0;
//         const dataStr = `${data.app_id}|${data.app_trans_id}|${data.app_time}|${data.embed_data}|${items}|${data.amount}|${status}`;
//         console.log('Data string for MAC:', dataStr); // Log chuỗi tạo MAC để kiểm tra

//         // Tính toán MAC với HMAC-SHA256
//         const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
//         console.log('Generated MAC:', mac); // Log MAC đã tính toán để kiểm tra

//         // So sánh MAC
//         if (mac !== callbackData.mac) {
//             console.warn('❌ Invalid MAC from ZaloPay!');
//             return res.status(400).json({
//                 return_code: -1,
//                 message: 'MAC mismatch',
//             });
//         }

//         // Nếu thanh toán thành công
//         if (data.return_code === 1 || data.status === 1) {
//             const embedData = JSON.parse(data.embed_data);
//             const {
//                 userReceives,
//                 products,
//                 promotionCode,
//                 discountAmount,
//                 totalAmount,
//                 itemsPrice,
//                 paymentMethod,
//                 userId,
//             } = embedData;

//             // Format lại products để đúng schema MongoDB
//             const formattedProducts = products.map((p) => ({
//                 product: p.productId, // ObjectId của sản phẩm
//                 count: p.quantity, // số lượng
//                 color: p.color,
//                 thumb: p.thumb,
//                 title: p.title,
//                 sku: p.sku,
//                 price: p.price,
//             }));

//             // Kiểm tra đơn hàng đã tồn tại chưa
//             const existingOrder = await Order.findOne({
//                 paymentOrderId: data.app_trans_id,
//             });

//             if (existingOrder) {
//                 return res.status(200).json({
//                     return_code: 1,
//                     message: 'Order already created',
//                 });
//             }

//             // Tạo đơn hàng mới
//             await Order.create({
//                 paymentOrderId: data.app_trans_id,
//                 products: formattedProducts,
//                 userReceives,
//                 promotionCode,
//                 discountAmount,
//                 total: totalAmount,
//                 itemsPrice,
//                 paymentMethod,
//                 orderby: userId,
//                 isPaid: true,
//                 paidAt: new Date(),
//                 status: 'CONFIRMED',
//                 statusHistory: [
//                     {
//                         status: 'CONFIRMED',
//                         note: 'Đơn hàng thanh toán ZaloPay đã thành công',
//                     },
//                 ],
//             });

//             return res.status(200).json({ return_code: 1, message: 'OK' });
//         } else {
//             return res.status(400).json({
//                 return_code: -1,
//                 message: 'Payment not successful',
//             });
//         }
//     } catch (error) {
//         console.error('❌ ZaloPay callback error:', error);
//         return res.status(500).json({
//             return_code: -1,
//             message: 'Internal Server Error',
//         });
//     }
// });
const zaloPayCallback = asyncHandler(async (req, res) => {
    try {
        const callbackData = req.body;

        // console.log('Callback received:', callbackData);

        // Kiểm tra có đủ data và mac không
        if (!callbackData.data || !callbackData.mac) {
            return res.status(400).json({
                return_code: -1,
                message: 'Invalid data or MAC missing',
            });
        }

        const dataStr = callbackData.data;
        const reqMac = callbackData.mac;

        // Tính lại MAC
        const generatedMac = CryptoJS.HmacSHA256(
            dataStr,
            config.key2
        ).toString();
        console.log('Generated MAC:', generatedMac);

        // Kiểm tra MAC có khớp không
        if (reqMac !== generatedMac) {
            console.warn(' MAC mismatch from ZaloPay!');
            return res.status(400).json({
                return_code: -1,
                message: 'MAC mismatch',
            });
        }

        // Parse dữ liệu từ dataStr
        const data = JSON.parse(dataStr);
        console.log('ZaloPay callback parsed:', data);

        // Kiểm tra thanh toán thành công

        const embedData = JSON.parse(data.embed_data);

        const {
            userReceives,
            products,
            promotionCode,
            discountAmount,
            totalAmount,
            itemsPrice,
            paymentMethod,
            userId,
        } = embedData;

        const formattedProducts = products.map((p) => ({
            product: p.productId,
            count: p.quantity,
            color: p.color,
            thumb: p.thumb,
            title: p.title,
            sku: p.sku,
            price: p.price,
        }));

        const existingOrder = await Order.findOne({
            paymentOrderId: data.app_trans_id,
        });

        if (existingOrder) {
            return res.status(200).json({
                return_code: 1,
                message: 'Order already exists',
            });
        }

        const newOrder = await Order.create({
            paymentOrderId: data.app_trans_id,
            products: formattedProducts,
            userReceives,
            promotionCode,
            discountAmount,
            total: totalAmount,
            itemsPrice,
            paymentMethod,
            orderby: userId,
            isPaid: true,
            paidAt: new Date(),
            status: 'CONFIRMED',
            statusHistory: [
                {
                    status: 'CONFIRMED',
                    note: 'Đơn hàng thanh toán ZaloPay đã thành công',
                },
            ],
        });
        if (promotionCode && newOrder) {
            await Promotion.findOneAndUpdate(
                { code: promotionCode },
                { $inc: { usedCount: 1 } },
                { new: true }
            );
        }
        // Sau khi tạo đơn, tiến hành giảm kho
        await Promise.all(
            newOrder.products.map(async (item) => {
                const prod = await Product.findById(item.product);
                if (!prod) return;

                if (prod.varriants?.length > 0) {
                    const variantIndex = prod.varriants.findIndex(
                        (v) => v.color === item.color && v.sku === item.sku
                    );
                    if (variantIndex !== -1) {
                        const variant = prod.varriants[variantIndex];
                        variant.quantity = Math.max(
                            0,
                            variant.quantity - item.count
                        );
                        variant.sold += item.count;
                        prod.markModified('varriants');
                    }
                } else {
                    prod.quantity = Math.max(0, prod.quantity - item.count);
                    prod.sold += item.count;
                }

                await prod.save();
            })
        );

        return res.status(200).json({
            return_code: 1,
            message: 'Order created successfully',
        });
    } catch (error) {
        console.error(' ZaloPay callback error:', error);
        return res.status(500).json({
            return_code: -1,
            message: 'Internal Server Error',
        });
    }
});

module.exports = {
    createZaloPayServices,
    zaloPayCallback,
};
