const User = require('../models/user')
const asyncHandeler = require('express-async-handler')

const register = asyncHandeler(async(req , res) => {
    const {email , password , firstname , lastname} = req.body
    if( !email || !password || !firstname | !lastname) 
        return res.status(400).json({
            sucess: false,
            mess: 'Một trong số các trường không tồn tại'
        })
    const response = await User.create(req.body)
        return res.status(200).json({
            sucess: response ? true : false,
            response,
            mess: ' Tạo User thành công'
        })
})

module.exports = {
    register
}