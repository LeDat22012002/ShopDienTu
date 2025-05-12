const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');

// Cấu hình VNPay
const VNPAY_CONFIG = {
    vnp_TmnCode: '9GYA9JM2', // Mã TMN Code bạn nhận từ VNPay
    vnp_HashSecret: 'QW7RZNPIQN5D8YFYIHH9TWMPT4IM78UG', // Secret Key bạn nhận từ VNPay
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL VNPay
    vnp_ReturnUrl: 'shop-dien-tu-ecuu.vercel.app/payment-success', // URL trả về sau khi thanh toán
    vnp_IpnUrl:
        'https://shopdientu-rg6y.onrender.com/api/paymentVnpay/vnpay-ipn', // URL nhận thông báo IPN
};

// Tạo URL thanh toán VNPay
exports.createVnPayPayment = async ({ amount, orderId, orderInfo }) => {
    const createDate = moment().format('YYYYMMDDHHmmss'); // Thời gian tạo đơn hàng
    const orderType = 'other'; // Loại thanh toán (có thể thay đổi nếu cần)
    const locale = 'vn'; // Ngôn ngữ hiển thị
    const currCode = 'VND'; // Đơn vị tiền tệ
    const ipAddr = '127.0.0.1'; // Địa chỉ IP (có thể lấy từ req.headers nếu cần)

    const vnp_Params = {
        vnp_Version: '2.1.0', // Phiên bản API VNPay
        vnp_Command: 'pay', // Lệnh thanh toán
        vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode, // Mã TMN Code
        vnp_Locale: locale, // Ngôn ngữ
        vnp_CurrCode: currCode, // Đơn vị tiền tệ
        vnp_TxnRef: orderId, // Mã đơn hàng
        vnp_OrderInfo: orderInfo, // Thông tin đơn hàng
        vnp_OrderType: orderType, // Loại đơn hàng
        vnp_Amount: amount * 100, // Số tiền cần thanh toán (VNPay yêu cầu tính bằng đồng)
        vnp_ReturnUrl: VNPAY_CONFIG.vnp_ReturnUrl, // URL trả về sau khi thanh toán
        vnp_IpAddr: ipAddr, // Địa chỉ IP của người gửi yêu cầu
        vnp_CreateDate: createDate, // Thời gian tạo đơn hàng
        vnp_IpnUrl: VNPAY_CONFIG.vnp_IpnUrl, // URL nhận thông báo IPN
    };

    // B1: Sắp xếp các tham số theo thứ tự bảng chữ cái
    const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());

    // B2: Tạo chuỗi query
    const signData = querystring.stringify(sortedParams, { encode: false });

    // B3: Tạo chữ ký SHA512
    const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
    const secureHash = hmac
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

    // B4: Thêm chữ ký vào tham số
    sortedParams.vnp_SecureHash = secureHash;

    // Tạo URL thanh toán hoàn chỉnh
    const paymentUrl = `${VNPAY_CONFIG.vnp_Url}?${querystring.stringify(
        sortedParams,
        { encode: true }
    )}`;

    // Trả về URL thanh toán
    return { paymentUrl };
};
