import axios from '../axois';

export const apiCreateFlashSale = (data) =>
    axios({
        url: '/flashsale/createFlashSale',
        method: 'post',
        data,
    });

export const apiGetFlashSales = (params) =>
    axios({
        url: '/flashsale/getFlashSales',
        method: 'get',
        params,
    });

export const apiDeleteFlashSales = (fsid) =>
    axios({
        url: '/flashsale/deleteFlashSale/' + fsid,
        method: 'delete',
    });

export const apiUpdateFlashSales = (data, fsid) =>
    axios({
        url: '/flashsale/updateFlashSale/' + fsid,
        method: 'put',
        data,
    });
