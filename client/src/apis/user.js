import axios from '../axois';

export const apiRegister = (data) =>
    axios({
        url: '/user/register',
        method: 'post',
        data,
    });

export const apiFinalRegister = (token) =>
    axios({
        url: '/user/finalregister/' + token,
        method: 'put',
    });

export const apiLogin = (data) =>
    axios({
        url: '/user/login',
        method: 'post',
        data,
    });

export const apiForgotPassword = (data) =>
    axios({
        url: '/user/forgotpassword',
        method: 'post',
        data,
    });

export const apiResetPassword = (data) =>
    axios({
        url: '/user/resetpassword',
        method: 'put',
        data,
    });

export const apiGetUserDetails = () =>
    axios({
        url: '/user/details',
        method: 'get',
    });

export const apiGetAllUser = (params) =>
    axios({
        url: '/user/alluser',
        method: 'get',
        params,
    });

export const apiUpdateUser = (data, uid) =>
    axios({
        url: `/user/updateUserByAdmin/${uid}`,
        method: 'put',
        data,
    });

export const apiDeleteUser = (uid) =>
    axios({
        url: `/user/deletedUser/${uid}`,
        method: 'delete',
    });

export const apiUpdateCurrent = (data) =>
    axios({
        url: `/user/updateUser`,
        method: 'put',
        data,
    });

export const apiUpdateCart = (data) =>
    axios({
        url: `/user/addCart`,
        method: 'put',
        data,
    });

export const apiDeleteCart = (pid) =>
    axios({
        url: `/user/removeCart/` + pid,
        method: 'delete',
    });
