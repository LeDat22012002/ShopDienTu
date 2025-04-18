const axios = require('axios');
const crypto = require('crypto');

const MOMO_CONFIG = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    requestType: 'captureWallet',
    redirectUrl: 'http://localhost:5173/payment-success',
    ipnUrl: 'http://localhost:5000/api/payment/momo-ipn',
};

exports.createMomoPayment = async ({ amount, orderId, orderInfo }) => {
    const requestId = orderId + '-' + Date.now();
    const orderType = 'momo_wallet';
    const extraData = ''; // có thể truyền thêm info

    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${MOMO_CONFIG.requestType}`;

    const signature = crypto
        .createHmac('sha256', MOMO_CONFIG.secretKey)
        .update(rawSignature)
        .digest('hex');

    const body = {
        partnerCode: MOMO_CONFIG.partnerCode,
        accessKey: MOMO_CONFIG.accessKey,
        requestId,
        amount: `${amount}`,
        orderId,
        orderInfo,
        redirectUrl: MOMO_CONFIG.redirectUrl,
        ipnUrl: MOMO_CONFIG.ipnUrl,
        extraData,
        requestType: MOMO_CONFIG.requestType,
        signature,
        orderType,
        lang: 'vi',
    };

    const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        body,
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );

    return response.data;
};
