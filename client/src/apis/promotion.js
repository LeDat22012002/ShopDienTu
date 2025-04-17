import axios from '../axois';

export const apiCreatePromotion = (data) =>
    axios({
        url: '/promotion/createPromotion',
        method: 'post',
        data,
    });

export const apiGetAllPromotions = (params) =>
    axios({
        url: '/promotion/allPromotion',
        method: 'get',
        params: params,
    });

export const applyPromotionCode = (data) =>
    axios({
        url: '/promotion/applyPromotion',
        method: 'post',
        data,
    });
export const apiDeletePromotion = (prid) =>
    axios({
        url: '/promotion/deletePromotion/' + prid,
        method: 'delete',
    });

export const apiUpdatePromotion = (data, prid) =>
    axios({
        url: '/promotion/updatePromotion/' + prid,
        method: 'put',
        data,
    });
