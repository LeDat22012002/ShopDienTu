import axios from '../axois';

export const apiCreateFlashSale = (data) =>
    axios({
        url: '/flashsale/createFlashSale',
        method: 'post',
        data,
    });
