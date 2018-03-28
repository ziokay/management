import env from '../../build/env';

const baseURL = env === 'development'
    ? '/proxy'
    : env === 'production'
        ? 'http://116.196.119.120/api/v1'
        : '/proxy';

export const CONFIG = {
    baseURL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true,
    timeout: 7000
};

export const URI = {
    // user
    LOGIN: '/users/login', // 登录
    USERINFO: '/users/show', // 用户信息
    // hotels
    HOTEL: '/hotels' // 添加 店铺
};
