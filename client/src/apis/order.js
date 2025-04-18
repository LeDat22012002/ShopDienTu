import axios from '../axois';

export const apiCreateOrder = (data) =>
    axios({
        url: '/order/createOrder',
        method: 'post',
        data,
    });
