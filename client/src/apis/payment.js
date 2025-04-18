import axios from '../axois';

export const apiCreateMomoPayment = (data) =>
    axios({
        url: '/payment/momo-create',
        method: 'post',
        data,
    });
