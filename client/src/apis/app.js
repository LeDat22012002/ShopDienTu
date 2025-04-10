import axios from '../axois';

export const apiGetCategories = () =>
    axios({
        url: '/category/getAllCt',
        method: 'get',
    });

export const apiGetAllCategories = (params) =>
    axios({
        url: '/category/getCategorys',
        method: 'get',
        params: params,
    });

export const apiCreateCategories = (data) =>
    axios({
        url: '/category/createCategory',
        method: 'post',
        data,
    });

export const apiUpdateCategories = (data, pcid) =>
    axios({
        url: '/category/updateCategory/' + pcid,
        method: 'put',
        data,
    });

export const apiDeleteCategories = (pcid) =>
    axios({
        url: '/category/deleteCategory/' + pcid,
        method: 'delete',
    });
