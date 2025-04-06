const Coupon = require('../models/counpon')
const AsyncHandler = require('express-async-handler')

const createCoupon = AsyncHandler(async (req, res) => {
        const { name , discount , expiry } = req.body
        if(!name || !discount || !expiry ) throw new Error('Missing inputs')
        // Kiểm tra xem blog đã tồn tại chưa
        const couponExists = await Coupon.findOne({ name: name});
        if (couponExists) {
            return res.status(400).json({
                success: false,
                message: "Mã khuyến mã đã tồn tại !"
            });
        }
        // Nếu chưa tồn tại, tạo mới
        const response = await Coupon.create({
            ...req.body ,
            expiry : Date.now() + +expiry*24*60*60*1000
        });
        return res.json({
            success: response ? true : false,
            createdCoupon: response ? response : 'Cannot create new Coupon !'
        });

});

const getCoupons = AsyncHandler(async( req , res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt')
    return res.status(200).json({
        success : response ? true : false,
        dataBlogs: response ? response : 'Cannot get All Coupon !'
    })
})


const updateCoupon = AsyncHandler(async (req, res) => {
    const { cid } = req.params;
    const { name  } = req.body
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if(req.body.expiry) req.body.expiry =  Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
    const existingCoupon = await Coupon.findOne({
        name: name,
        _id: { $ne: cid }, 
    });

    if (existingCoupon) {
        return res.status(400).json({
            success: false,
            message: "Mã khuyến mãi đã tồn tại, vui lòng chọn tên khác!",
        });
    }

    // Cập nhật bài viết
    const response = await Coupon.findByIdAndUpdate(cid, req.body, {
        new: true,
    });

    return res.status(200).json({
        success: response ? true : false,
        dataBlog: response || "Cannot update Coupon!",
    });

});

const deleteCoupon = AsyncHandler(async(req , res ) => {
    const { cid } = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.status(200).json({
        success : response ? true : false,
        mess : 'Delete Coupon Successfully !',
        deletedCoupon: response 
    }) 
})
module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}