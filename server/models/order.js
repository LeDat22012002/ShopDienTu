const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                count: { type: Number },
                color: { type: String },
                thumb: { type: String },
                title: { type: String },
                price: { type: Number },
            },
        ],
        userReceives: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            city: { type: String }, // Thành phố
            district: { type: String }, // Quận/Huyện
            ward: { type: String }, // Phường/Xã
            detail: { type: String }, // Địa chỉ chi tiết (số nhà, tên đường,...)
        },
        paymentMethod: { type: String },
        itemsPrice: { type: Number },
        total: { type: Number },
        coupon: {
            type: mongoose.Types.ObjectId,
            ref: 'Coupon',
        },
        orderby: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date }, // Thời gian thanh toán
        status: {
            type: String,
            enum: [
                'PENDING', // Chờ xác nhận
                'CONFIRMED', // Đã xác nhận
                'SHIPPING', // Đang giao hàng
                'COMPLETED', // Hoàn thành
                'CANCELLED', // Đã hủy
            ],
            default: 'PENDING',
        },
        statusHistory: [
            {
                status: String,
                updatedAt: Date, // thời điểm cập nhật trạng thái
                note: String, // ghi chú
            },
        ],
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);
