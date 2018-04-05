<style scoped lang="less">
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
            <Col :xs="24" :sm="24" :lg="14" style="margin-bottom: 15px;">
                <Card>
                    <p slot="title">{{ getName(topic) || '主题' }}</p>
                    <div slot="extra">
                        <!-- <a href="#" @click.prevent="showInputModal('showSortModal')" style="margin:auto 20px;">
                            <Icon type="ios-plus-empty"></Icon>
                            新建类别
                        </a> -->
                        <a href="#" @click.prevent="showInputModal('showOptionModal')" style="margin:auto 20px;">
                            <Icon type="ios-plus-empty"></Icon>
                            新建项
                        </a>
                        <Dropdown @on-click="changeTopic" style="margin:auto 20px;">
                            <a href="javascript:void(0)">
                                <Icon type="arrow-down-b"></Icon>
                                切换类别
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem
                                    v-for="(value, key, index) in data"
                                    :key="'sort' + index"
                                    :name="key"
                                    :selected="topic === key">
                                {{ getName(key) }}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <a href="#" @click.prevent="submitData(targetData)" style="margin:auto 20px;">
                            <Icon type="upload"></Icon>
                            保存
                        </a>
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
            <Col :xs="24" :sm="24" :lg="{ span: 9, offset: 1 }" style="margin-bottom: 15px;">
                <Card>
                    <p slot="title">预览</p>
                    <div slot="extra">
                        <a href="#" @click.prevent="fetchData">
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
            @on-ok="addDataSort(sort)">
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
            @on-ok="addDataOption(topic, option)">
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
import Cookie from 'js-cookie';
export default {
    name: 'menu-setting',
    data () {
        return {
            data: {},
            // card
            icon: 'android-list',
            title: '菜单发布',
            topic: '', // 当前主题，即种类名
            // modal
            showSortModal: false,
            sort: '',
            showOptionModal: false,
            option: '', // 新添加的选项
            // transfer
            transferTitles: [ '未添加项（不会保存）', '已添加项' ],
            transferData: [],
            targetKeys: [],
            listStyle: {
                width: '41%',
                height: '500px',
                marginBottom: '15px',
                // 'text-align': 'left',
            },
            operations: ['<<','>>'],
            // tree
            targetData: [],
            treeData: [],
            isLoading: true
        };
    },
    watch: {
        data (data) {
            const { key } = this.findEntryByIndex(data, 0);
            this.setTargetKeys(data);
            this.setTargetData(data, this.targetKeys);
            this.changeTopic(key);
        },
        targetData (data) {
            this.setTreeData(data);
            this.isLoading = false;
        }
    },
    methods: {
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
        // topic
        getName (sort) {
            const map = {
                hot_dishes: '热菜',
                cold_dishes: '冷菜',
                soups: '汤类',
                staple_foods: '主食',
                fruits: '水果'
            };
            return map[sort];
        },
        changeTopic (name = '') {
            this.topic = name;
            this.setTransferData(this.data[name]);
        },
        // transfer
        setTransferData (data = []) {
            let arr = [];
            data.forEach(el => {
                arr.push({
                    key: el,
                    label: el
                });
            });
            this.transferData = arr;
        },
        setTargetKeys (data = {}) {
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
            this.setTargetData(this.data, newTargetKeys);
        },
        // tree
        setTargetData (data = {}, targets = []) {
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
        formatSubtree (obj) {
            let subtree = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let children = [];
                    obj[key].forEach(el => {
                        if (util.isObject(el)) {
                            children.push({
                                title: '更多',
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
                        title: this.getName(key),
                        expand: true,
                        children
                    });
                }
            }
            return subtree;
        },
        setTreeData (data = {}) {
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
        showInputModal (name) {
            this[name] = true;
        },
        addDataSort (topic) {
            if (topic !== '') {
                this.data[topic] = [];
                this.setTargetData(this.data, this.targetKeys);
                this.changeTopic(topic);
            }
        },
        addDataOption (topic, option) {
            if (option !== '') {
                this.data[topic].push(option);
                this.changeTopic(topic);
            }
        },
        // data
        fetchData (payload) {
            this.isLoading = true;
            this.ajax('getMenu', payload)
                .then((data) => {
                    this.data = data;
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
        submitData (data) {
            const payload = {
                menuID: Cookie.get('menuID'),
                menu: JSON.stringify(data)
            };
            this.ajax('setMenu', payload)
                .then((data) => {
                    this.$Message.success('保存成功');
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
    },
    activated () {
        this.fetchData();
    }
};
</script>
