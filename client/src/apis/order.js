import axios from '../axois';

export const apiCreateOrder = (data) =>
    axios({
        url: '/order/createOrder',
        method: 'post',
        data,
    });

export const apiGetOrders = (params) =>
    axios({
        url: '/order/getAllOrder',
        method: 'get',
        params,
    });

export const apiGetOrderByUser = (params) =>
    axios({
        url: '/order/getUserOrder',
        method: 'get',
        params,
    });

export const apiCancelOrderByUser = (oid) =>
    axios({
        url: '/order/cancelOrder/' + oid,
        method: 'put',
    });

export const apiUpdateStatusOrder = (data, oid) =>
    axios({
        url: '/order/updateStatus/' + oid,
        method: 'put',
        data,
    });
