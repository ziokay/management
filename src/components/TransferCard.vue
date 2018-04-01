<style lang="less">
    .spin-container{
        position: relative;
    }

    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>

<template>
    <Card dis-hover>
        <p slot="title">
            <Icon :type="icon"></Icon>
            {{ title }}
        </p>
        <Row>
            <Col :xs="24" :sm="24" :lg="15" style="margin-bottom: 15px;">
                <Card>
                    <p slot="title">{{ topic === '' ? '主题' : topic }}</p>
                    <div slot="extra">
                        <a href="#" @click.prevent="showInputModal('showSortModal')" style="margin:auto 20px;">
                            <Icon type="ios-plus-empty"></Icon>
                            新建类别
                        </a>
                        <a href="#" @click.prevent="showInputModal('showOptionModal')" style="margin:auto 20px;">
                            <Icon type="ios-plus-empty"></Icon>
                            新建项
                        </a>
                        <Dropdown @on-click="setTransferData" style="margin:auto 20px;">
                            <a href="javascript:void(0)">
                                切换类别
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem
                                    v-for="(value, key, index) in data"
                                    :key="'item' + index"
                                    :name="key"
                                    :selected="topic === ''
                                                ? index === 0
                                                : topic === key">
                                {{ key }}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <Transfer
                        :titles="transferTitles"
                        :data="transferData"
                        :target-keys="targetKeys"
                        :list-style="listStyle"
                        :operations="operations"
                        filterable
                        @on-change="changeTargetKeys"
                        style="text-align:center;">
                        <!-- :render-format="render" -->
                    </Transfer>
                </Card>
            </Col>
            <Col :xs="24" :sm="24" :lg="{ span:8, offset:1 }" style="margin-bottom: 15px;">
                <Card>
                    <p slot="title">预览</p>
                    <div slot="extra">
                        <a href="#" @click.prevent="refreshData(query)">
                            <Icon type="ios-loop-strong"></Icon>
                            刷新重置
                        </a>
                    </div>
                    <div style="width:40%;margin:0 auto;">
                        <Tree
                            :data="treeData"
                            :render="renderContent">
                            <!-- show-checkbox -->
                        </Tree>
                    </div>
                </Card>
            </Col>
            <Spin size="large" fix v-if="isLoading"></Spin>
        </Row>
        <Modal
            title="新建类别"
            v-model="showSortModal"
            class-name="vertical-center-modal"
            @on-visible-change="clearSort"
            @on-ok="addPageDataSort(sort)">
            <Input placeholder="请输入新添加类别......" v-model="sort" clearable autofocus>
                <span slot="prepend">
                    <Icon :size="16" type="android-send"></Icon>
                </span>
            </Input>
        </Modal>
        <Modal
            title="新建选项"
            v-model="showOptionModal"
            class-name="vertical-center-modal"
            @on-visible-change="clearOption"
            @on-ok="addPageDataOption(topic, option)">
            <Input placeholder="请输入新添加选项......" v-model="option" clearable autofocus>
                <span slot="prepend">
                    <Icon :size="16" type="android-send"></Icon>
                </span>
            </Input>
        </Modal>
    </Card>
</template>
<script>
    import util from '@/libs/util';
    export default {
        name: 'transfer-card',
        props: {
            icon: String,
            title: String,
            data: {
                type: Object,
                default: {}
            },
            // 方便请求参数传递
            query: Object,
        },
        data () {
            return {
                pageData: this.data,
                // card props
                topic: '', // 当前主题，即种类名
                showSortModal: false,
                sort: '',
                showOptionModal: false,
                option: '', // 新添加的选项
                // transfer props
                transferTitles: [ '未添加项（不会保存）', '已添加项' ],
                transferData: [],
                targetKeys: [],
                listStyle: {
                    width: '41%',
                    height: '400px',
                    marginBottom: '15px'
                },
                operations: ['<<','>>'],
                // tree props
                targetData: this.data,
                treeData: [],
                isLoading: true
            }
        },
        watch: {
            query (newQuery) {
                this.refreshData(newQuery);
            },
            data (data) {
                const { key: name } = this.findEntryByIndex(data, 0);
                if (this.topic === '') {
                    this.topic = name || '';
                    this.pageData = data;
                    this.setTargetKeys(data);
                }
            },
            pageData (data) {
                this.setTransferData(this.topic);
            },
            targetKeys (newKeys) {
                this.setTargetData(this.pageData, newKeys);
            },
            targetData (data) {
                this.setTreeData(data);
                this.isLoading = false;
            }
        },
        methods: {
            // transfer
            findEntryByIndex (obj, index) {
                let num = -1;
                for (let [ key, value ] of Object.entries(obj)) {
                    num++;
                    if (num !== index) {
                        continue;
                    }
                    return { key, value };
                }
                return {};
            },
            formatTransferData (data) {
                let arr = [];
                data.forEach(el => {
                    arr.push({
                        key: el,
                        label: el
                    });
                });
                return arr;
            },
            setTransferData (name) {
                if (!name || name === '') {
                    return;
                }
                this.transferData = this.formatTransferData(this.pageData[name]);
                this.topic = name;
            },
            // targetKeys
            setTargetKeys (data) {
                let arr = [];
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        arr = arr.concat(data[key]);
                    }
                }
                this.targetKeys = arr;
            },
            changeTargetKeys (newTargetKeys, direction, moveKeys) {
                this.targetKeys = newTargetKeys;
                this.setTargetData(this.pageData, this.targetKeys);
                this.submitData(this.query, this.targetData);
            },
            setTargetData (data, targets) {
                let obj = {};
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        let value = [];
                        data[key].forEach(el => {
                            if (util.isObject(el)) {
                                value.push(this.setTargetData(el));
                            } else if (util.isString(el)) {
                                targets.forEach(tar => {
                                    if (tar === el) {
                                        value.push(el);
                                    }
                                });
                            }
                        });
                        obj[key] = value;
                    }
                }
                this.targetData = obj;
            },
            // modal
            clearSort (bool) {
                if (bool) {
                    this.sort = '';
                }
            },
            clearOption (bool) {
                if (bool) {
                    this.option = '';
                }
            },
            showInputModal (modelName) {
                this[modelName] = true;
            },
            addPageDataSort (topic) {
                if (topic !== '') {
                    this.pageData[topic] = [];
                    this.setTransferData(topic);
                    this.setTargetData(this.pageData, this.targetKeys);
                }
            },
            addPageDataOption (topic, option) {
                if (option !== '') {
                    this.pageData[topic].push(option);
                    this.setTransferData(topic);
                }
            },
            // tree
            formatSubtree (obj) {
                let subtree = [];
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        let children = [];
                        obj[key].forEach(el => {
                            if (util.isObject(el)) {
                                children.push({
                                    title: el.toString(),
                                    expand: true,
                                    children: this.formatSubtree(el)
                                });
                            } else if (util.isString(el)) {
                                children.push({
                                    title: el,
                                    expand: true
                                });
                            }
                        });
                        subtree.push({
                            title: key,
                            expand: true,
                            children
                        });
                    }
                }
                return subtree;
            },
            setTreeData (data) {
                const treeData = [
                    {
                        title: '全部',
                        expand: true,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    "font-size": '16px!important'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ])
                            ]);
                        },
                        children: this.formatSubtree(data)
                    }
                ];
                this.treeData = treeData;
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                        "font-size": '16px!important'
                    }
                }, 
                [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    // h('span', {
                    //     style: {
                    //         // display: 'inline-block',
                    //         // float: 'right',
                    //         marginLeft: '32px',
                    //         marginRight: '32px'
                    //     }
                    // }, [
                    //     h('a', {
                    //         style: {
                    //             marginRight: '8px'
                    //         },
                    //         on: {
                    //             click: () => { this.append(data) }
                    //         }
                    //     }, [
                    //         h('Icon', {
                    //             props: {
                    //                 type: 'ios-plus-empty'
                    //             },
                    //             style: {
                    //                 marginRight: '8px'
                    //             }
                    //         })
                    //     ]),
                    //     h('a', {
                    //         on: {
                    //             click: () => { this.remove(root, node, data) }
                    //         }
                    //     }, [
                    //         h('Icon', {
                    //             props: {
                    //                 type: 'ios-minus-empty'
                    //             },
                    //             style: {
                    //                 marginRight: '8px'
                    //             }
                    //         })
                    //     ])
                    // ])
                ]);
            },
            // append (data) {
            //     const children = data.children || [];
            //     children.push({
            //         title: 'appended node',
            //         expand: true
            //     });
            //     this.$set(data, 'children', children);
            // },
            // remove (root, node, data) {
            //     const parentKey = root.find(el => el === node).parent;
            //     const parent = root.find(el => el.nodeKey === parentKey).node;
            //     const index = parent.children.indexOf(data);
            //     parent.children.splice(index, 1);
            // },
            // data
            refreshData (query) {
                this.topic = '';
                this.isLoading = true;
                this.$emit('fetchData', query);
            },
            submitData (query, data) {
                this.$emit('submitData', { query, data });
            }
        },
        activated () {
            this.refreshData(this.query);
        }
    };
</script>
