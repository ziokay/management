<style lang="less">
</style>

<template>
    <transfer-card v-bind="props" @fetchData="fetchData" @submitData="submitData">
    </transfer-card>
</template>

<script>
import TransferCard from '@/components/TransferCard';
import Cookie from 'js-cookie';
export default {
    name: 'menu-setting',
    components: {
        TransferCard
    },
    data () {
        return {
            props: {
                icon: 'android-list',
                title: '菜单发布',
                // columns: {
                //     index: {
                //         type: 'index',
                //         title: '序号',
                //         align: 'center',
                //         width: 65
                //     },
                //     name: {
                //         title: '店名',
                //         key: 'name',
                //         align: 'center'
                //     },
                //     address: {
                //         title: '地址',
                //         key: 'address',
                //         ellipsis: true,
                //         align: 'center'
                //     },
                //     people: {
                //         title: '适宜人群',
                //         key: 'people',
                //         ellipsis: true,
                //         align: 'center'
                //     },
                //     price: {
                //         title: '价位',
                //         key: 'price',
                //         align: 'center'
                //     },
                //     doc: {
                //         title: '附件',
                //         key: 'doc',
                //         align: 'center',
                //         render: (h, params) => {
                //             return h('a', {
                //                 attrs: {
                //                     href: params.row.doc,
                //                     rel: 'nofollow'
                //                 }
                //             }, '下载');
                //         }
                //     },
                //     owner_name: {
                //         title: '店主名',
                //         key: 'owner_name',
                //         align: 'center'
                //     },
                //     owner_phone: {
                //         title: '店主手机号',
                //         key: 'owner_phone',
                //         align: 'center'
                //     },
                //     show_more: {
                //         title: '详情',
                //         key: 'show_more',
                //         align: 'center',
                //         width: 100,
                //         render: (h, params) => {
                //             return h('Button', {
                //                 props: {
                //                     type: 'primary',
                //                     size: 'default'
                //                 },
                //                 on: {
                //                     click: () => {
                //                         this.$router.push({
                //                             name: 'table-detail',
                //                             params: params.row
                //                         });
                //                     }
                //                 }
                //             }, '详情');
                //         }
                //     }
                // },
                // checked: [
                //     'index', 'name', 'address', 'price',
                //     'owner_name', 'owner_phone', 'show_more'
                // ],
                data: {},
                query: {
                    hotelID: Cookie.get('hotelID'),
                    menuID: Cookie.get('menuID')
                }
                // total: 0,
                // status: {
                //     [-1]: '已拒绝',
                //     [0]: '待处理',
                //     [1]: '已通过' 
                // },
                // initStatus: this.status
            }
        };
    },
    methods: {
        fetchData (payload) {
            this.ajax('getMenu', payload)
                .then((data) => {
                    this.props.data = data;
                    this.props.query.menuID = Cookie.get('menuID');
                })
                .catch((err) => {
                    if (err.logout) {
                        this.$Message.error('用户登录有效期已失效，请重新登录');
                        // 退出登录状态
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                    } else {
                        this.$Message.error('请求数据时发生错误');
                    }
                });
        },
        submitData ({ query: { menuID }, data }) {
            const menu = JSON.stringify(data);
            this.ajax('setMenu', { menuID, menu })
                .then((data) => {
                    this.props.data = JSON.parse(data.menu);
                })
                .catch((err) => {
                    if (err.logout) {
                        this.$Message.error('用户登录有效期已失效，请重新登录');
                        // 退出登录状态
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                    } else {
                        this.$Message.error('保存数据时发生错误');
                    }
                });
        }
    }
};
</script>
