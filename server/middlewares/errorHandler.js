const notFound = (req , res , next) => {
    const error = new Error(`Route ${req.originalUrl} không tồn tại `)
    res.status(404)
    next(error)
}

const errHandle = (error , req , res  , next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json( {
        success: false,
        mess: error?.message
    })

}

module.exports = {
    notFound ,
    errHandle
}