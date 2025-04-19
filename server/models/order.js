const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        paymentOrderId: { type: String },
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                count: { type: Number, required: true },
                color: { type: String },
                thumb: { type: String },
                title: { type: String },
                sku: { type: String },
                price: { type: Number, required: true },
            },
        ],

        userReceives: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            city: { type: String, required: true },
            district: { type: String, required: true },
            ward: { type: String, required: true },
            detail: { type: String, required: true },
        },

        paymentMethod: {
            type: String,
            required: true,
            enum: ['cod', 'momo', 'vnpay'],
        },

        itemsPrice: { type: Number, required: true },

        //  Mã giảm giá không cần tham chiếu
        promotionCode: { type: String, default: null },
        discountAmount: { type: Number, default: 0 },

        total: { type: Number, required: true },

        orderby: { type: mongoose.Types.ObjectId, ref: 'User', required: true },

        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },

        status: {
            type: String,
            enum: [
                'PENDING',
                'CONFIRMED',
                'SHIPPING',
                'COMPLETED',
                'CANCELLED',
            ],
            default: 'PENDING',
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        'PENDING',
                        'CONFIRMED',
                        'SHIPPING',
                        'COMPLETED',
                        'CANCELLED',
                    ],
                },
                updatedAt: { type: Date, default: Date.now },
                note: { type: String },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
