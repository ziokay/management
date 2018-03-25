import { router } from '../../router/index';
// import http from '../../api';

const columns = {
    // checkbox: {
    //     type: 'selection',
    //     title: '多选',
    //     width: 60,
    //     align: 'center'
    // },
    index: {
        type: 'index',
        title: '序号',
        align: 'center',
        width: 60
    },
    name: {
        title: '用户名',
        key: 'name',
        align: 'center',
        sortable: true
    },
    age: {
        title: '年龄',
        key: 'age',
        align: 'center'
    },
    // description: {
    //     title: '简介',
    //     key: 'description',
    //     align: 'center',
    //     width: 140
    // },
    phone: {
        title: '联系方式',
        key: 'phone',
        align: 'center'
    },
    // people: {
    //     title: '适宜人群',
    //     key: 'people',
    //     align: 'center'
    // },
    // price: {
    //     title: '价位',
    //     key: 'price',
    //     align: 'center'
    // },
    // other: {
    //     title: '其它',
    //     key: 'other',
    //     align: 'center'
    // },
    // menu: {
    //     title: '菜单',
    //     key: 'menu',
    //     align: 'center'
    // },
    // doc: {
    //     title: '附件',
    //     key: 'doc',
    //     align: 'center'
    // },
    // owner_id: {
    //     title: '店主账号',
    //     key: 'owner_id',
    //     align: 'center'
    // },
    heath: {
        title: '健康状况',
        key: 'heath',
        align: 'center'
    },
    note: {
        title: '提示',
        key: 'note',
        align: 'center'
    },
    // allow: {
    //     title: '结果',
    //     key: 'allow',
    //     align: 'center',
    //     filters: [
    //         {
    //             label: '未通过名单',
    //             value: 0
    //         },
    //         {
    //             label: '通过名单',
    //             value: 1
    //         }
    //     ],
    //     filterMultiple: false,
    //     filterMethod (value, row) {
    //         if (value === 0) {
    //             return row.allow === 0;
    //         } else if (value === 1) {
    //             return row.allow === 1;
    //         }
    //     },
    //     render: (h, params) => {
    //         if (params.row.allow === 1) {
    //             return h('div', '通过');
    //         } else if (params.row.allow === 0) {
    //             return h('div', '未通过');
    //         } else {
    //             return h('div', '未知');
    //         }
    //     }
    // },
    end: {
        title: '合约期',
        key: 'end',
        align: 'center'
    },
    // staff_name: {
    //     title: '审核人',
    //     key: 'staff_name',
    //     align: 'center'
    // },
    finish: {
        title: '审核',
        key: 'finish',
        align: 'center',
        width: 80,
        render: (h, params) => {
            return h('Button', {
                props: {
                    type: 'text',
                    size: 'small'
                },
                on: {
                    click: () => {
                        router.push({
                            name: 'table-detail',
                            params: params.row
                        });
                    }
                }
            }, '详情');
        }
    }
};

const table = {
    namespaced: true,
    state: {
        columns,
        review: {
            data: [],
            total: 81
        },
        result: {
            data: [],
            total: 81
        },
        list: {
            data: [],
            total: 81
        }
    },
    getters: {},
    mutations: {
        setData (state, payload) {
            state[payload.page].data = payload.data;
            state[payload.page].total = payload.total;
        }
    },
    actions: {
        fetchData ({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                let result = false;
                http.getTable(payload)
                    .then(data => {
                        result = true;
                        data.page = payload.page;
                        commit('setData', data);
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(`HTTP error, fetchData failed: ${err.message}`);
                        resolve(result);
                    });
            });
        },
        submitAllow ({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                let result = false;
                http.putTable(payload)
                    .then(data => {
                        result = true;
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(`HTTP error, submitAllow failed: ${err.message}`);
                        resolve(result);
                    });
            });
        }
    }
};

export default table;
