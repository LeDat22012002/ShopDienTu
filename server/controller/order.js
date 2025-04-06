const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/counpon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async( req ,res) => {
    const { _id } = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }))
    let total = userCart?.cart?.reduce((sum , el) => el.product.price * el.quantity + sum , 0)
    const createData = { products , total , orderby: _id}
    if(coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon?.discount /100 ) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const rs = await Order.create(createData)
    return res.status(200).json({
        success: rs ? true : false ,
        createOrdered : rs ? rs : 'Something went wrong !'

    })
    
})

const updateStatusOrder = asyncHandler(async( req , res) => {
    const { oid} = req.params
    const { status} = req.body
    if(!status) throw new Error('Missing input')
    const response = await Order.findByIdAndUpdate( oid , {status}, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        updatedOrder: response ? response : ' Can not Update Status Order !'
    })
})
const getOrders = asyncHandler(async(req , res) => {
    const response = await Order.find()
    return res.status(200).json({
        success : response ? true : false,
        dataOrder: response ? response : 'Can not get All Order !'
    })
})

const getUserOrder = asyncHandler(async(req , res) => {
    const {_id} = req.user
    const response = await Order.find( {orderby: _id})
    return res.status(200).json({
        success : response ? true : false,
        dataOrder: response ? response : 'Can not get All Order !'
    })
})

module.exports = {
    createOrder,
    updateStatusOrder,
    getOrders,
    getUserOrder
}