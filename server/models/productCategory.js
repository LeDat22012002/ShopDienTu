const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            require: true,
        },
        brand: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Brand',
            },
        ],
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('ProductCategory', productCategorySchema);
