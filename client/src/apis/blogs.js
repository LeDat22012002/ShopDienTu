import axios from '../axois';
export const apiCreateBlogs = (data) =>
    axios({
        url: '/blog/createBlog',
        method: 'post',
        data,
    });

export const apiGetBlogs = (params) =>
    axios({
        url: '/blog/getAllBlog',
        method: 'get',
        params: params,
    });

export const apiUpdateBlog = (data, bid) =>
    axios({
        url: '/blog/updateBlog/' + bid,
        method: 'put',
        data,
    });

export const apiDeleteBlog = (bid) =>
    axios({
        url: '/blog/deleteBlog/' + bid,
        method: 'delete',
    });
