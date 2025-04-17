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
