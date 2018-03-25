import axios from 'axios';
import {
    config,
    url
} from './config.js';
import Cookie from 'js-cookie';

const http = axios.create(config);

http.interceptors.request.use(
    config => {
        const token = Cookie.get('token');
        if (token) { // 如果存在 token，每个http header都加上 token
            config.headers['Authorization'] = `Bearer ${token}`;
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
        const data = {
            phone,
            password
        };
        return http.post(url.POST_LOGIN, data) // 默认发送 json
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
    getInfo () {
        return http.get(url.GET_USER_INFO)
            .then(res => {
                // const data=res.data.data
                if (data) {
                    return data;
                } else {
                    return Promise.reject(res.data);
                }
            })
            .catch(err => {
                console.log('err getInfo', err.massage);
                return Promise.reject(err);
            });
    }
};

export default api;
