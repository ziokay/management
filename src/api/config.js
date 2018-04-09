import env from '../../build/env';

const baseURL = env === 'development'
    ? '/proxy'
    : env === 'production'
        ? 'http://116.196.119.120/api/v1'
        : '/proxy';

export const CONFIG = {
    baseURL,    //http://116.196.119.120/api/v1
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true,
    timeout: 7000,
};

export const URI = {
    LOGIN: '/users/login', // 登录
    USERINFO: '/users/show', // 用户信息
    NEW_USERINFO: '/users/update',
    HOTEL: '/hotels', // 店铺
    // MENU: '/menus'
    ORDER: '/orders' // 订单
};
