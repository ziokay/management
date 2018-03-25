import env from '../../build/env';

const baseURL = env === 'development'
    ? '/dev'
    : env === 'production'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

export const config = {
    baseURL, // baseURL: 'http://116.196.119.120/api/v1'
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true,
    timeout: 7000
};

export const url = {
    // users
    POST_LOGIN: '/users/login' ,// 登录
    GET_USER_INFO:'/users/show' , //获取用户信息
    POST_USER_INFO:'/users/update',//更新用户信息

};
