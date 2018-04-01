<style lang="less">
</style>

<template>
    <Card>
        <p slot="title">
            <Icon :type="icon"></Icon>
            {{ title }}
        </p>
        <Row type="flex" justify="center" align="bottom">
            <Col span="18">
                <Checkbox-group v-model="checked" style="margin-bottom: 6px;">
                    <template v-for="(value, key) in columns">
                        <Checkbox :label="key" :key="key">{{ value.title }}</Checkbox>
                    </template>
                </Checkbox-group>
            </Col>
            <Col span="6">
                <div style="margin: 0 10px 10px 0; float: right;">
                    <template v-if="status">
                        <Radio-group v-model="radioStatus" type="button">
                            <template v-for="(value, key) in status" @on-change="changeRadioStatus">
                                <Radio :label="key" :key="key">{{ value }}</Radio>
                            </template>
                        </Radio-group>
                    </template>
                    <template v-else>
                        <slot name="otherBtn"></slot>
                    </template>
                </div>
            </Col>
        </Row>
        <Row type="flex" justify="center" align="middle">
            <Table
                :size="tableSize"
                :columns="columnsShown"
                :data="data"
                :loading="isLoading"
                style="width: 100%;"
                border
            ></Table>
        </Row>
        <div style="margin: 10px;">
            <Radio-group v-model="tableSize" type="button" size="small">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            <div style="float: right;">
                <Page
                    size="small"
                    :total="total"
                    :current="pageIndex"
                    @on-change="changePageIndex"
                    :page-size="pageSize"
                    @on-page-size-change="changePageSize"
                    show-elevator
                    show-sizer
                    show-total
                ></Page>
            </div>
        </div>
    </Card>
</template>

<script>
export default {
    name: 'table-card',
    props: {
        icon: String,
        title: String,
        checked: {          // 选择显示的表格列
            type: Array,
            default: []
        },
        columns: Object,    // 所有表格列的字段定义
        initTableSize: {    // 表格宽窄
            type: String,
            default: 'default',
            validator: (value) => {
                return value === 'large' || value === 'default' || value === 'small';
            }
        },
        data: Array,        // 表格内数据
        total: {            // 数据库上数据总量
            type: Number,
            default: 0
        },
        status: {
            type: Object,
            default: null
        },
        initStatus: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            // 表格相关
            isLoading: true, // 设置是否显示加载状态
            tableSize: this.initTableSize,
            // 分页Page相关
            pageIndex: 1, // 表示第几页的序号
            pageSize: 10, // 每页条数
            // 数据相关
            radioStatus: this.initStatus // 后台接口参数
        };
    },
    computed: {
        columnsShown () {
            let selectedColumns = [],
                hasCheckbox = false,
                hasIndex = false,
                hasShowMore = false,
                hasEdit = false;

            this.checked.forEach(col => {
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
                        selectedColumns.push(this.columns[col]);
                }
            });

            if (hasIndex) {
                selectedColumns.unshift(this.columns['index']);
            }
            if (hasCheckbox) {
                selectedColumns.unshift(this.columns['checkbox']);
            }
            if (hasShowMore) {
                selectedColumns.push(this.columns['show_more']);
            }
            if (hasEdit) {
                selectedColumns.push(this.columns['edit']);
            }
            return selectedColumns;
        },
        query () {
            return {
                index: this.pageIndex,
                size: this.pageSize,
                status: this.radioStatus
            };
        }
    },
    watch: {
        query (newQuery) {
            this.refreshData(newQuery);
        },
        data () {
            this.isLoading = false;
        }
    },
    methods: {
        changePageIndex (newIndex) {
            this.pageIndex = newIndex;
        },
        changePageSize (newSize) {
            this.pageSize = newSize;
        },
        changeRadioStatus (newStatus) {
            this.radioStatus = newStatus;
        },
        refreshData (query) {
            this.isLoading = true;
            this.$emit('fetchData', query);
        }
    },
    activated () {
        this.radioStatus = this.initStatus;
        this.refreshData(this.query);
    }
};
</script>
