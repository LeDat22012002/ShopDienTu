const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');

const config = {
    app_id: '2554', // test app_id của bạn
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn', // key1 sandbox
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf', // key2 sandbox
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

const createZaloPayOrder = async ({
    userReceives,
    products,
    promotionCode,
    discountAmount,
    totalAmount,
    itemsPrice,
    paymentMethod,
    userId,
}) => {
    if (!userId) {
        throw new Error('Thiếu userId (app_user)');
    }

    if (!products || products.length === 0) {
        throw new Error('Không có sản phẩm trong đơn hàng');
    }

    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

    const embed_data = {
        userReceives,
        products,
        promotionCode,
        discountAmount,
        totalAmount,
        itemsPrice,
        paymentMethod,
        userId,
        redirecturl: 'http://localhost:5173/',
        callback_url:
            'https://e6c4-2405-4802-90f1-ff0-1d3e-fa22-cd76-aea7.ngrok-free.app/api/paymentZalopay/zalopay-callback',
    };

    const items = products.map((p) => ({
        itemid: String(p.sku),
        itemname: String(p.title),
        itemprice: Math.round(p.price),
        itemquantity: Math.round(p.count),
        thumb: p.thumb || '',
        color: p.color || '',
        product: String(p.product), // Chuyển ObjectId về string để đảm bảo serializable
    }));
    const amount = Number(totalAmount) || 0;

    const order = {
        app_id: config.app_id,
        app_trans_id,
        app_user: String(userId),
        app_time: Date.now(),
        item: JSON.stringify(items || []),
        embed_data: JSON.stringify(embed_data || {}),
        amount,
        description: `Shop - Payment for order #${transID}`,
        bank_code: '',
        callback_url:
            'https://e6c4-2405-4802-90f1-ff0-1d3e-fa22-cd76-aea7.ngrok-free.app/api/paymentZalopay/zalopay-callback',
    };

    //  Tạo MAC theo chuẩn ZaloPay
    const macInput = [
        order.app_id,
        order.app_trans_id,
        order.app_user,
        order.amount,
        order.app_time,
        order.embed_data,
        order.item,
    ].join('|');

    order.mac = CryptoJS.HmacSHA256(macInput, config.key1).toString();

    // //  Log thông tin debug
    // console.log('ZaloPay Order Debug >>>');
    // console.log('Order:', order);
    // console.log('MAC Input:', macInput);
    // console.log('MAC:', order.mac);
    // console.log('POST to:', config.endpoint);

    const requestData = new URLSearchParams();
    for (const key in order) {
        requestData.append(key, order[key]);
    }

    try {
        const response = await axios.post(config.endpoint, requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // console.log('ZaloPay API response:', response.data);

        return {
            payUrl: response.data.order_url,
            app_trans_id,
        };
    } catch (error) {
        console.error(
            'ZaloPay API error:',
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.sub_return_message ||
                'Lỗi khi tạo đơn ZaloPay'
        );
    }
};

module.exports = {
    createZaloPayOrder,
};
