import axios from 'axios';
import {
    CONFIG,
    URI
} from './config.js';
import Cookie from 'js-cookie';

const http = axios.create(CONFIG);

http.interceptors.request.use(
    config => {
        const token = Cookie.get('token');
        if (token) { // 如果存在 token，每个 request 都加上 token
            config.params = {
                token
            };
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

http.interceptors.response.use(
    res => {
        const data = res.data;
        if (data.status === 401 && /token/g.test(data.message)) {
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
    login({
        phone,
        password
    }) {
        const data = {
            phone,
            password
        };
        return http.post(URI.LOGIN, data) // 默认发送 json
            .then(res => {
                const data = res.data.data;
                if (data && data.token) {
                    Cookie.set('token', data.token);
                    return data.user;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('login error: ', err.message);
                return Promise.reject(err);
            });
    },
    getUserInfo() {
        return http.get(URI.USERINFO)
            .then(res => {
                const data = res.data.data;
                if (data && data.name) {
                    Cookie.set('user', data.name);
                    if (data.hotel) {
                        Cookie.set('hotelID', data.hotel.id);
                    }
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
    setUserInfo (data) {
        return http.patch(URI.NEW_USERINFO, data)
            .then(res => {
                const data = res.data.data;
                if (data && data.name) {
                    Cookie.set('user', data.name);
                    return data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err setUserInfo', err.message);
                return Promise.reject(err);
            });
    },
    // name 	string 	是 	店铺名称 	店铺名称
    // description 	string 	是 	店铺简介 	店铺简介
    // address 	string 	是 	店铺地址 	店铺地址
    // lng 	number 	是 	店铺经度 	123.123
    // lat 	number 	是 	店铺维度 	123.123
    // people 	string 	是 	适用人群 	适用人群
    // price 	number 	是 	店铺价格 	1000
    // type 	number 	是 	店铺类型 	0
    // other 	string 	是 	其它提示 	其它提示
    // doc 	file 	否 	上传资料压缩包(可选),后缀名必须为zip
    signup(data) {
        return http.post(URI.HOTEL, data)
            .then(res => {
                const data = res.data;
                if (data.status === 201 && data.data) {
                    Cookie.set('hotelID', data.data.id);
                    return data.data;
                } else {
                    return Promise.reject(data);
                }
            })
            .catch(err => {
                console.log('err signup', err.message);
                return Promise.reject(err);
            });
    },
    /**
     * 商家信息
     */
<<<<<<< HEAD
    getHotelInfo({
        hotel_id
    }) {
        return http.get(`${URI.HOTEL}/${hotel_id}`)
=======
    getHotelInfo () {
        const hotelID = Cookie.get('hotelID');
        return http.get(`${URI.HOTEL}/${hotelID}`)
>>>>>>> cffff7450d965434e1b8557c41da0d9a40578cf5
            .then(res => {
                const data = res.data;
                if (data && data.data) {
                    return data.data;
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
<<<<<<< HEAD
    setHotelInfo({
        hotel_id,
        data
    }) {
        return http.put(`${URI.HOTEL}/${hotel_id}`, data)
=======
    setHotelInfo (data) {
        const hotelID = Cookie.get('hotelID');
        return http.put(`${URI.HOTEL}/${hotelID}`, data)
>>>>>>> cffff7450d965434e1b8557c41da0d9a40578cf5
            .then(res => {
                const data = res.data;
                if (data && data.data) {
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
<<<<<<< HEAD
    getMenu({
        hotel_id
    }) {
        return http.get(`${URI.HOTEL}/${hotel_id}/menu`)
=======
    getMenu () {
        const hotelID = Cookie.get('hotelID');
        return http.get(`${URI.HOTEL}/${hotelID}/menu`)
>>>>>>> cffff7450d965434e1b8557c41da0d9a40578cf5
            .then(res => {
                const data = res.data;
                if (data.status === 200 && data.data) {
                    Cookie.set('menuID', data.data.id);
                    return data.data.menu
                        ? JSON.parse(data.data.menu)
                        : {
                            hot_dishes: [],
                            cold_dishes: [],
                            soups: [],
                            staple_foods: [],
                            fruits: []
                        };
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err getMenu', err.message);
                return Promise.reject(err);
            });
    },
<<<<<<< HEAD
    setMenu({
        menu_id,
        menu
    }) {
        return http.put(`/menus/${menu_id}`, {
                menu
            })
=======
    setMenu ({ menuID, menu }) {
        return http.put(`/menus/${menuID}`, { menu })
>>>>>>> cffff7450d965434e1b8557c41da0d9a40578cf5
            .then(res => {
                const data = res.data;
                if (data.data && data.data.menu) {
                    return JSON.parse(data.data.menu);
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
<<<<<<< HEAD
    // getOrders ({ hotelID }) {
    //     const hotelID=Cookie.get('hotel_id');
    //     return http.get(`${URI.HOTEL}/${hotelID}/orders`)
    //         .then(res => {
    //             const data = res.data.data;
    //             if (data) {
    //                 return data;
    //             } else {
    //                 return Promise.reject(res.data);
    //             }
    //         })
    //         .catch(err => {
    //             console.log('err getOrders', err.message);
    //             return Promise.reject(err);
    //         });
    // },
    getOrder({
        hotel_id,
        index: page,
        size: per_page,
        status
    }) {
        const hotelID = Cookie.get('hotel_id');
        const config = {
            params: {
                hotel_id,
                page,
                per_page,
                status,
            }
        };
        return http.get(`${URI.HOTEL}/${hotelID}/orders`, config)
=======
    getOrders () {
        const hotelID = Cookie.get('hotelID');
        return http.get(`${URI.HOTEL}/${hotelID}/orders`)
>>>>>>> cffff7450d965434e1b8557c41da0d9a40578cf5
            .then(res => {
                const data = res.data;
                if (data) {
                    return {
                        total: data.total,
                        data
                    };
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
<<<<<<< HEAD
                console.log('getOrder error: ', err.message);
                return Promise.reject(err);
            });
    },
    setOrder ({ order_id, status}){
        const order=Cookie.get('order_id');
=======
                console.log('getOrders error: ', err.message);
                return Promise.reject(err);
            });
    },
    setOrder ({ id, finish}){
        const order=Cookie.get('hotelID');
>>>>>>> cffff7450d965434e1b8557c41da0d9a40578cf5
        const config = {params:{status: finish===1?1:0}};
        return http.post(`${URL.ORDER}/${order}/agree`,config)
            .then(res => {
                const data = res.data;
                if (data.status === 201 && data.data) {
                    return data.data;
                } else {
                    return Promise.reject(data);
                }
            })
            .catch(err => {
                console.log('err setOrder', err.message);
                return Promise.reject(err);
            });
    }
};

export default (method, payload) => method ? api[method](payload) : api;