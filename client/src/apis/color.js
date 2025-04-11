import axios from '../axois';

export const apiCreateColor = (data) =>
    axios({
        url: '/color/createColor',
        method: 'post',
        data,
    });

export const apiGetAllColors = (params) =>
    axios({
        url: '/color/colors',
        method: 'get',
        params: params,
    });

export const apiUpdateColor = (data, clid) =>
    axios({
        url: '/color/updateColor/' + clid,
        method: 'put',
        data,
    });

export const apiDeleteColor = (clid) =>
    axios({
        url: '/color/deleteColor/' + clid,
        method: 'delete',
    });
