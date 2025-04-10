const User = require('../models/user');
const asyncHandeler = require('express-async-handler');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../ultils/sendMail');
const cryptojs = require('crypto');
const makeToken = require('uniqid');

// refreshtoken => cấp mới accessToken
// accessToken => Xác thực người dùng , phân quyền người dùng

const register = asyncHandeler(async (req, res) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name || !phone) {
        return res.status(400).json({
            success: false,
            mess: 'Missing inputs',
        });
    }
    const user = await User.findOne({ email: email });
    if (user) {
        throw new Error('User has Exited !');
    } else {
        const token = makeToken();
        const emailedited = btoa(email) + '@' + token;
        const newUser = await User.create({
            email: emailedited,
            password,
            name,
            phone,
        });
        if (newUser) {
            const html = `<h2>Register code: </h2><br /><blockquote>${token}</blockquote>`;
            await sendMail({
                email,
                html,
                subject: 'Confirm register account in ShopDienTu!',
            });
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailedited });
        }, [500000]);
        return res.json({
            success: newUser ? true : false,
            mess: newUser
                ? 'Please check your email to active account'
                : 'Something went wrong , Please try later !',
        });
    }
});
const finalRegister = asyncHandeler(async (req, res) => {
    const { token } = req.params;
    const notActivedEmail = await User.findOne({
        email: new RegExp(`${token}$`),
    });
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0]);
        notActivedEmail.save();
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mess: notActivedEmail
            ? 'Register is successfuly. Please go Login !'
            : 'Something went wrong , Please try later !',
    });
});

const loginUser = asyncHandeler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            mess: 'Missing inputs',
        });
    }

    const response = await User.findOne({ email: email });
    if (response && (await response.isCorrectPassword(password))) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } =
            response.toObject();
        // Tạo accessToken
        const accessToken = generateAccessToken(response._id, role);
        // Tạo refreshToken
        const newRefreshToken = generateRefreshToken(response._id);
        // Lưu refreshToken vào Database
        await User.findByIdAndUpdate(
            response._id,
            { refreshToken: newRefreshToken },
            { new: true }
        );
        // Lưu refreshToke vào cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            accessToken,
            userData: userData,
        });
    } else {
        throw new Error(' Email or password is incorrect!');
    }
});

const getDetailsUser = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-refreshToken -password ');
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User does not exist!',
    });
});

const refreshAccessToken = asyncHandeler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies;
    // Check xem có Token hay không
    if (!cookie && !cookie.refreshToken)
        throw new Error('No refreshToken in Cookie');
    // Check Token có còn hạn sử dụng không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({
        _id: rs._id,
        refreshToken: cookie.refreshToken,
    });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? generateAccessToken(response._id, response.role)
            : 'Refresh Token is not valid',
    });
});

const logoutUser = asyncHandeler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken)
        throw new Error(' No refresh token in cookies');
    // Xóa refresh Token ở Database
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    );
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });

    return res.status(200).json({
        success: true,
        mess: 'Logout successfully !',
    });
});

// Client gửi email
// Server check email có hợp lệ hay không => Gửi email + kèm theo link (password change token)
// Client check email => click vào link
// Client gửi API kèm token
// Check token có giống với token server gửi mail hay không
// Change password

const forgotPassword = asyncHandeler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('Missing Email !');
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found!');
    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu ! , Link này sẽ hết hạng sau 15 phút . <a
    href=${process.env.CLIENT_ULR}/reset-password/${resetToken}>Click Here<a/>`;

    const data = {
        email,
        html,
        subject: 'Forgot Password',
    };

    const rs = await sendMail(data);
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mess: rs.response?.includes('OK')
            ? 'Check your mail phease.'
            : ' Something went wrong.Please try later',
    });
});

const resetPassword = asyncHandeler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error('Missing inputs');
    const passwordResetToken = cryptojs
        .createHash('sha256')
        .update(token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error('Invalid reset Token');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        mess: user ? 'Updated Password !' : 'Something went wrong',
    });
});

const getUsers = asyncHandeler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các operators cho đúng cú pháp mongdb
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (macthedEl) => `$${macthedEl}`
    );
    const formatedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name)
        formatedQueries.name = { $regex: queries.name, $options: 'i' };
    // const query = {};
    // if (req.query.q) {
    //     query = {
    //         $or: [
    //             {
    //                 name: { $regex: req.query.q, $options: 'i' },
    //             },
    //             { email: { $regex: req.query.q, $options: 'i' } },
    //         ],
    //     };
    // }

    if (req.query.q) {
        delete formatedQueries.q;
        formatedQueries['$or'] = [
            {
                name: { $regex: req.query.q, $options: 'i' },
            },
            { email: { $regex: req.query.q, $options: 'i' } },
        ];
    }

    // console.log(formatedQueries);
    let queryCommand = User.find(formatedQueries);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    // limit : số oject lấy về 1 lần gọi API
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    // Số lượng sp thõa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    try {
        const response = await queryCommand.exec(); // Loại bỏ callback
        const counts = await User.find(formatedQueries).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            users: response || 'Cannot get all user!',
            counts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
const deleteUser = asyncHandeler(async (req, res) => {
    const { uid } = req.params;
    const responses = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        success: responses ? true : false,
        mess: responses
            ? ` User with email ${responses.email} deleted !`
            : 'No User delete !',
    });
});

const updateUser = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    if (!_id || Object.keys(req.body).length === 0)
        throw new Error('Missing input');
    const userUpdate = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
    }).select('-refreshToken -password -role -passwordChangeAt ');
    return res.status(200).json({
        success: userUpdate ? true : false,
        updatedUser: userUpdate ? userUpdate : 'Some thing went wrong !',
    });
});

const updateUserByAdmin = asyncHandeler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing input');
    const userUpdate = await User.findByIdAndUpdate(uid, req.body, {
        new: true,
    }).select('-refreshToken -password -role -passwordChangeAt ');
    return res.status(200).json({
        success: userUpdate ? true : false,
        mess: userUpdate
            ? 'Account updated successfully'
            : 'Some thing went wrong !',
    });
});

const updateAddressUser = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing input');
    const userUpdate = await User.findByIdAndUpdate(
        _id,
        { $push: { address: req.body.address } },
        { new: true }
    ).select('-refreshToken -password -role -passwordChangeAt ');
    return res.status(200).json({
        success: userUpdate ? true : false,
        updatedUser: userUpdate ? userUpdate : 'Some thing went wrong !',
    });
});

const addCart = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity, color } = req.body;
    if (!pid || !quantity || !color) throw new Error('Missing inputs');
    const user = await User.findById(_id).select('cart');
    const alreadyProduct = user?.cart?.find(
        (el) => el?.product?.toString() === pid?.toString()
    );

    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User.updateOne(
                { cart: { $elemMatch: alreadyProduct } },
                { $set: { 'cart.$.quantity': quantity } },
                { new: true }
            );
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Some thing went wrong !',
            });
        } else {
            const response = await User.findByIdAndUpdate(
                _id,
                { $push: { cart: { product: pid, quantity, color } } },
                { new: true }
            );
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Some thing went wrong !',
            });
        }
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { cart: { product: pid, quantity, color } } },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Some thing went wrong !',
        });
    }
});

module.exports = {
    register,
    loginUser,
    getDetailsUser,
    refreshAccessToken,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateAddressUser,
    addCart,
    finalRegister,
};
