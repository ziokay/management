import axios from 'axios';
import { CONFIG, URI } from './config.js';
import Cookie from 'js-cookie';

const http = axios.create(CONFIG);

http.interceptors.request.use(
    config => {
        const token = Cookie.get('token');
        if (token && config.params) { // 如果存在 token，每个 request 都加上 token
            config.params.token = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

http.interceptors.response.use(
    res => {
        const data = res.data;
        if (data.status === 401 && /JWT/g.test(data.message)) {
            const logoutError = {
                logout: true,
                message: 'token过期'
            };
            return Promise.reject(logoutError);
        }
        return res;
    },
    err => {
        return Promise.reject(err);
    });

const api = {
    login ({ phone, password }) {
        const data = { phone, password };
        return http.post(URI.LOGIN, data) // 默认发送 json
            .then(res => {
                const data = res.data.data;
                if (data && data.token) {
                    return {
                        token: data.token,
                        id: data.user.id,
                        phone
                    };
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('login error: ', err.message);
                return Promise.reject(err);
            });
    },
    getUserInfo () {
        return http.get(URI.USERINFO)
            .then(res => {
                const data = res.data.data;
                if (data && data.hotel) {
                    return data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err getUserInfo', err.message);
                return Promise.reject(err);
            });
    },
    signup ({ data }) {
        return http.post(URI.HOTEL, data)
            .then(res => {
                const data = res.data;
                if (data.status === 201 && data.data) {
                    return data.data;
                } else {
                    return Promise.reject(data);
                }
            })
            .catch(err => {
                console.log('err getUserInfo', err.message);
                return Promise.reject(err);
            });
    },
    /**
     * 商家信息
     */
    getHotelInfo ({ hotel_id }) {
        return http.get(`${URI.HOTEL}/${hotel_id}`)
            .then(res => {
                const data = res.data.data.data;
                if (data) {
                    return data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err getHotelInfo', err.message);
                return Promise.reject(err);
            });
    },
    // name 	string 	是 	新店铺名称 	新店铺名称
    // description 	string 	是 	新店铺简介 	新店铺简介
    // address 	string 	是 	新店铺地址 	新店铺地址
    // lng 	number 	是 	新店铺经度 	123.123
    // lat 	number 	是 	新店铺维度 	123.123
    // people 	string 	是 	新适用人群 	新适用人群
    // price 	string 	是 	新店铺价格 	999
    // type 	number 	是 	新店铺类型 	0
    // other 	string 	是 	新其它提示
    setHotelInfo ({ hotel_id, data }) {
        return http.put(`${URI.HOTEL}/${hotel_id}`, data)
            .then(res => {
                const data = res.data.data;
                if (data.status === 201 && data.data) {
                    return data.data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err setHotelInfo', err.message);
                return Promise.reject(err);
            });
    },
    /**
     * 菜单发布
     */
    getMenu ({ hotel_id }) {
        return http.get(`${URI.HOTEL}/${hotel_id}/menu`)
            .then(res => {
                const data = res.data;
                if (data.status === 201 && data.data) {
                    return data.data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err getMenu', err.message);
                return Promise.reject(err);
            });
    },
    setMenu ({ menu_id, menu }) {
        return http.put(`/menus/${menu_id}`, { menu })
            .then(res => {
                const data = res.data;
                if (data.status === 201 && data.data) {
                    return data.data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err setMenu', err.message);
                return Promise.reject(err);
            });
    },
    /**
     * 饭桌订单
     */
    getOrders ({ hotel_id }) {
        return http.get(`${URI.HOTEL}/${hotel_id}/orders`)
            .then(res => {
                const data = res.data.data;
                if (data) {
                    return data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err getOrders', err.message);
                return Promise.reject(err);
            });
    }
};

export default api;
