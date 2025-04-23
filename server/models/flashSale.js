const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema(
    {
        title: { type: String },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                salePrice: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                sold: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('FlashSale', flashSaleSchema);
