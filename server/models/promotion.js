const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        description: String,
        discountType: {
            type: String,
            enum: ['percent', 'fixed'],
            required: true,
        },
        discountValue: { type: Number, required: true },
        minOrderValue: { type: Number, default: 0 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        usageLimit: { type: Number, default: 0 }, // 0 = không giới hạn
        usedCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);
