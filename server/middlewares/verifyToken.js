const jwt = require('jsonwebtoken');
const asynHandler = require('express-async-handler');

const verifyAccessToken = asynHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err)
                return res.status(401).json({
                    success: false,
                    mes: 'AccessToken không hợp lệ !',
                });
            // console.log(decode);
            req.user = decode;
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Không tìm thấy Token !',
        });
    }
});

const isAdmin = asynHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin')
        return res.status(401).json({
            success: false,
            mes: 'REQUIRE ADMIN ROLE',
        });
    next();
});

module.exports = {
    verifyAccessToken,
    isAdmin,
};
