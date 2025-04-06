const mongoose = require('mongoose'); // Erase if already required

var roleSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Role', roleSchema);
