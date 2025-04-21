import axios from '../axois';

export const apiCreateZaloPayment = (data) =>
    axios({
        url: '/paymentZalopay/zalopay-create',
        method: 'post',
        data,
    });
