import axios from '../axois';

export const apiGetOrderToday = () =>
    axios({
        url: '/dashboard/order-today',
        method: 'get',
    });

export const apiGetOrder30days = () =>
    axios({
        url: '/dashboard/order-30days',
        method: 'get',
    });
export const apiGetRevenueToday = () =>
    axios({
        url: '/dashboard/revenue-today',
        method: 'get',
    });

export const apiGetVisitsToday = () =>
    axios({
        url: '/dashboard/visits-today',
        method: 'get',
    });

export const apiCreateVisit = () =>
    axios({
        url: '/visit/createVisit',
        method: 'post',
    });
