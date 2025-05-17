const { default: mongoose } = require('mongoose');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_ULR_ATLATS);
        if (conn.connection.readyState === 1) {
            console.log(' Connect Database thanh cong !');
        } else console.log('Connect Database that bai !');
    } catch (error) {
        console.log('co loi');
        throw new Error(error);
    }
};

module.exports = dbConnect;
