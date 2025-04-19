import axios from '../axois';

export const apiCreateVNpayPayment = (data) =>
    axios({
        url: '/paymentVNpay/createVnPay',
        method: 'post',
        data,
    });
