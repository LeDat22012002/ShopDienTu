const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const cryptojs = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },
        loginType: {
            type: String,
            default: 'account',
        },
        phone: { type: String, default: null }, // Xóa unique: true
        password: {
            type: String,
            required: function () {
                return !this.googleId && !this.facebookId; // Không bắt buộc nếu có Google hoặc Facebook ID
            },
        },
        googleId: { type: String },
        facebookId: { type: String },
        avatar: { type: String },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        cart: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                quantity: Number,
                color: String,
            },
        ],
        address: {
            type: String,
        },
        wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
        isBlocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        passwordChangeAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: String,
        },
        registerToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
    createPasswordChangedToken: function () {
        const resetToken = cryptojs.randomBytes(32).toString('hex');
        this.passwordResetToken = cryptojs
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        return resetToken;
    },
};

//Export the model
module.exports = mongoose.model('User', userSchema);
