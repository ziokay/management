<style lang="less">

</style>

<template>
    <div>
        <table-card v-bind="props" @fetchData="fetchData">
        </table-card>
    </div>
</template>

<script>
import TableCard from './TableCard';
export default {
    name: 'PageView',
    components: {
        TableCard
    },
    props: {
        status: {
            type: Number,
            require: true
        }
    },
    data () {
        return {
            props: {
                icon: 'android-list',
                title: '商家列表',
                columns: {
                    index: {
                        type: 'index',
                        title: '序号',
                        align: 'center',
                        width: 65
                    },
                    name: {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    age: {
                        title: '年龄',
                        key: 'age',
                        ellipsis: true,
                        align: 'center'
                    },
                    phone: {
                        title: '电话号码',
                        key: 'phone',
                        align: 'center'
                    },
                    health: {
                        title: '健康状况',
                        key: 'health',
                        align: 'center'
                    },
                    end: {
                        title: '截至日期',
                        key: 'end',
                        align: 'center'
                    },
                    note: {
                        title: '提示',
                        key: 'note',
                        align: 'center'
                    },
                    show_more: {
                        title: '详情',
                        key: 'show_more',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'default'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'table-detail',
                                            params: params.row
                                        });
                                    }
                                }
                            }, '详情');
                        }
                    }
                },
                checked: [
                    'index', 'name', 'age', 'phone','health',
                    'note','end','show_more'
                ],
                data: [],
                total: 0,
                status: {
                    [-1]: '已拒绝',
                    [0]: '待处理',
                    [1]: '已通过' 
                },
                initStatus: this.status
            },
            method: 'getTable'
        };
    },
    methods: {
        fetchData (payload) {
        //     this.ajax(this.method, payload)
        //         .then(({ data, total }) => {
        //             this.props.data = data;
        //             this.props.total = total;
        //         })
        //         .catch((err) => {
        //             this.$Message.error('请求数据时发生错误');
        //         });
        }
    }
};
</script>
