import axios from '../axois';

export const apiGetAllBrands = (params) =>
    axios({
        url: '/brand/getBrands',
        method: 'get',
        params: params,
    });

export const apiUpdateBrand = (data, brid) =>
    axios({
        url: '/brand/updateBrand/' + brid,
        method: 'put',
        data,
    });

export const apiDeleteBrand = (brid) =>
    axios({
        url: '/brand/deleteBrand/' + brid,
        method: 'delete',
    });

export const apiCreateBrand = (data) =>
    axios({
        url: '/brand/createBrand',
        method: 'post',
        data,
    });
