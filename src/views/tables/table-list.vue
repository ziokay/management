<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <table-card
            :iconType="card.icon"
            :title="card.title"
            :columnsDefined="table.columns"
            :columnsChecked="table.checked"
            :tableData="data"
            :total="total"
        >
            <!-- <Button type="primary" @click="toResultList" slot="otherBtn">未通过列表</Button> -->
        </table-card>
    </div>
</template>

<script>
import TableCard from './components/TableCard';
export default {
    name: 'table-review',
    components: {
        TableCard
    },
    data () {
        const space = 'table',
              name = 'review',
              state = this.$store.state[space];
        return {
            name,
            space,
            card: {
                icon: 'compose',
                title: '商家审核'
            },
            table: {
                columns: (() => {
                    const cols = Object.assign({}, state.columns);
                    delete cols.menu;
                    delete cols.allow;
                    delete cols.staff_id;
                    delete cols.staff_name;
                    return cols;
                })(),
                checked: [
                    'index', 'name', 'age',
                    'phone', 'heath',
                    'note', 'end','finish'
                ]
            }
        };
    },
    computed: {
        data () {
            return this.$store.state[this.space][this.name].data;
        },
        total () {
            return this.$store.state[this.space][this.name].total;
        }
    },
    methods: {
        fetchData ({ pageIndex, pageSize }) {
            this.$store.dispatch({
                type: this.space + '/fetchData',
                page: this.name,
                pageIndex,
                pageSize,
                status: 0
            });
        },
        toResultList () {
            this.$router.push({
                name: 'table-result'
            });
        }
    }
};
</script>
