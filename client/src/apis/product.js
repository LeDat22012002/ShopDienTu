import axios from '../axois';

export const apiGetProduct = (params) =>
    axios({
        url: '/product/getAllPrs',
        method: 'get',
        params: params,
    });

export const apiGetDetailsProduct = (pid) =>
    axios({
        url: '/product/detailsPr/' + pid,
        method: 'get',
    });

export const apiRatings = (data) =>
    axios({
        url: '/product/ratings',
        method: 'put',
        data,
    });

export const apiCreateProduct = (data) =>
    axios({
        url: '/product/createProduct',
        method: 'post',
        data,
    });

export const apiUpdateProduct = (data, pid) =>
    axios({
        url: '/product/updatePr/' + pid,
        method: 'put',
        data,
    });

export const apiDeleteProduct = (pid) =>
    axios({
        url: '/product/deletePr/' + pid,
        method: 'delete',
    });
