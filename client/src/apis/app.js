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
