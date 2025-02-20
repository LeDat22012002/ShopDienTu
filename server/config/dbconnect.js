const {default : mongoose} = require('mongoose')

const dbConnect = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_ULR)
        if(conn.connection.readyState ===1 ) {
            console.log('ket noi DB thanh cong')
        }else console.log('ket noi DB that bai')
    } catch (error) {
        console.log('co loi' )
        throw new Error(error)
    }
}

module.exports =dbConnect