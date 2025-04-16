const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
        },
        thumb: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: {
            type: Array,
        },

        color: {
            type: String,
        },

        ratings: [
            {
                star: { type: Number },
                postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
                comment: { type: String },
                updatedAt: { type: Date },
            },
        ],
        totalRatings: {
            type: Number,
            default: 0,
        },
        varriants: [
            {
                color: String,
                price: Number,
                thumb: String,
                images: Array,
                title: String,
                sku: String,
                quantity: Number,
                sold: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);
