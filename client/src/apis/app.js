import axios from '../axois';


export const apiGetCategories = () => axios({
    url: '/category/getAllCt',
    method:'get'
})