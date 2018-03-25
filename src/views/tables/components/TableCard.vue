<style lang="less">

</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon :type="iconType"></Icon>
                {{ title }}
            </p>
            <Row type="flex" justify="center" align="bottom">
                <Col span="23">
                    <Checkbox-group v-model="columnsChecked" style="margin-bottom: 6px;">
                        <template v-for="(value, key) of columnsDefined">
                            <Checkbox :label="key" :key="key">{{ value.title }}</Checkbox>
                        </template> 
                    </Checkbox-group>
                </Col>
                <Col span="1">
                    <div style="margin: 0 10px 10px 0; float: right;">
                        <slot name="otherBtn"></slot>
                    </div>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Table
                    :size="tableSize"
                    :columns="columnsShown"
                    :data="tableData"
                    style="width: 100%;"
                    highlight-row
                ></Table>
            </Row>
            <div style="margin: 10px;">
                <Radio-group v-model="tableSize" type="button" size="small">
                    <!-- <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio> -->
                </Radio-group>
                <div style="float: right;">
                    <Page
                        size="small"
                        :total="total"
                        :current="pageIndex"
                        @on-change="changePageIndex"
                        show-elevator
                        show-total
                    ></Page>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'table-card',
    props: {
        iconType: String,
        title: String,
        columnsChecked: {  // 选择显示的表格列
            type: Array,
            default: []
        },
        columnsDefined: Object, // 定义表格列的字段
        tableSize: {            // 表格宽窄
            type: String,
            default: 'default',
            validator: (value) => {
                return value === 'large' || value === 'default' || value === 'small';
            }
        },
        tableData: Array,       // 表格内数据
        total: {                // 数据库上数据总量
            type: Number,
            require: true
        }
    },
    data () {
        return {
            // 表格相关
            // tableLoading: true, // 设置是否显示加载状态

            // 分页Page相关
            pageSize: 20, // 每页条数
            pageIndex: 1
        };
    },
    computed: {
        columnsShown () {
            let selectedColumns = [],
                hasCheckbox = false,
                hasIndex = false,
                hasShowMore = false,
                hasEdit = false;

            this.columnsChecked.forEach(col => {
                switch(col) {
                    case 'checkbox':
                        hasCheckbox = true;
                        break;
                    case 'index':
                        hasIndex = true;
                        break;
                    case 'show_more':
                        hasShowMore = true;
                        break;
                    case 'edit':
                        hasEdit = true;
                        break;
                    default:
                        selectedColumns.push(this.columnsDefined[col]);
                }
            });

            if (hasIndex) {
                selectedColumns.unshift(this.columnsDefined['index']);
            }
            if (hasCheckbox) {
                selectedColumns.unshift(this.columnsDefined['checkbox']);
            }
            if (hasShowMore) {
                selectedColumns.push(this.columnsDefined['show_more']);
            }
            if (hasEdit) {
                selectedColumns.push(this.columnsDefined['edit']);
            }
            return selectedColumns;
        }
    },
    watch: {
        tableData () {
            this.tableLoading = false;
        }
    },
    methods: {
        changePageIndex (newPageIndex) {
            this.pageIndex = newPageIndex;
            this.refreshTableData(this.pageIndex, this.pageSize);

        },
        refreshTableData (pageIndex, pageSize) {
            this.tableLoading = true;
            this.$emit('fetchData', {
                pageIndex,
                pageSize
            });
        }
    },
    created () {
        this.refreshTableData(1, 10);
    },
    activated () {
        this.refreshTableData(this.pageIndex, this.pageSize);
    }
};
</script>
