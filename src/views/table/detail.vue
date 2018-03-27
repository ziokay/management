<style lang="less">
    @import '../../styles/common.less';

    p {
        word-break: break-all;
    }
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-home"></Icon>
                商家信息
            </p>
            <Form 
                :label-width="100" 
                label-position="right"
            >
                <Row>
                    <Col span="6" offset="3">
                        <FormItem label="店铺名：">
                            <div style="display:inline-block;width:100px;">
                                <span>{{ data.name }}</span>
                            </div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="地址：">
                            <span>{{ data.address }}</span>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="价位：">
                            <span>{{ data.price }}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="3">
                        <FormItem label="店主姓名：">
                            <span>{{ data.owner_name }}</span>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="手机号：">
                            <span>{{ data.owner_phone }}</span>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="附件：">
                            <a :href="data.doc" rel="nofollow">下载</a>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="3">
                        <FormItem label="适宜人群：">
                            <span>{{ data.people }}</span>
                        </FormItem>
                        <!-- <div style="display:inline-block;padding:10px;"></div> -->
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="3">
                        <FormItem label="商铺简介：">
                            <p>{{ data.description }}</p>
                        </FormItem>
                        <!-- <div style="display:inline-block;padding:10px;"></div> -->
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="3">
                        <FormItem label="菜单：">
                            <p>{{ data.menu }}</p>
                        </FormItem>
                        <!-- <div style="display:inline-block;padding:10px;"></div> -->
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="3">
                        <FormItem label="其它提示：">
                            <p>{{ data.other }}</p>
                        </FormItem>
                    </Col>
                </Row>
                <template v-if="hasSubmit">
                    <Row>
                        <Col span="6" offset="3">
                            <FormItem label="审核结果：">
                                <span>{{ data.allow === 1 ? '已通过' : '已拒绝' }}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="审核人：" v-if="data.admin_name">
                                <span>{{ data.admin_name }}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="审核人IP：" v-if="data.admin_ip">
                                <span>{{ data.admin_ip }}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6" offset="10">
                            <div>
                                <Button
                                    type="primary"
                                    style="width: 100px;"
                                    @click="toLastPage"
                                >
                                确定
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </template>
                <template v-else>
                    <Row>
                        <Col span="6" offset="3">
                            <FormItem label="审核结果：">
                                <RadioGroup v-model="result">
                                    <Radio :label="1" :disabled="hasSubmit">已通过</Radio>
                                    <Radio :label="-1" :disabled="hasSubmit">已拒绝</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6" offset="10">
                            <div>
                                <Button
                                    type="text"
                                    style="width: 100px;"
                                    @click="toLastPage"
                                >
                                取消
                                </Button>
                                <Button
                                    type="primary"
                                    style="width: 100px;"
                                    :loading="isSaving"
                                    @click="handleSubmit"
                                >
                                确定
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </template>
            </Form>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'table-detail',
    data () {
        const data = this.$route.params;
        return {
            isSaving: false,
            data,
            result: data.allow
        };
    },
    computed: {
        hasSubmit () {
            return this.data.allow !== 0;
        },
        form () {
            return {
                id: this.data.id,
                status: this.result
            };
        }
    },
    methods: {
        toLastPage () {
            this.$store.commit('removeTag', 'table-detail');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                // 原模板的问题：路径跳转不是跳转到上一级
                // lastPageName = this.$store.state.app.pageOpenedList[1].name;
                const len = this.$store.state.app.pageOpenedList.length;
                lastPageName = this.$store.state.app.pageOpenedList[len - 1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        handleSubmit () {
            if (this.form.status !== 0) {
                this.saveInfo('setTable', this.form);
            } else {
                this.$Message.error('请选择审核结果');
            }
        },
        // 上传数据
        saveInfo (method, payload) {
            this.isSaving = true;
            this.$Message.loading({
                content: '保存中......',
                duration: 0
            });
            return this.ajax(method, payload)
                .then((data) => {
                    this.$Message.destroy();
                    this.$Message.success('审核提交成功');
                    this.data.allow = this.result;
                    this.result = 0;
                    this.isSaving = false;
                })
                .catch((err) => {
                    this.$Message.destroy();
                    if (err.logout) {
                        this.$Message.error('用户登录有效期已失效，请重新登录');
                        // 退出登录状态
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                    } else {
                        this.$Message.error('审核提交失败');
                    }
                    this.isSaving = false;
                })
        }
    },
    activated () {
        const localData = localStorage[localStorage.currentPageName] ? JSON.parse(localStorage[localStorage.currentPageName]) : null;
        if (localData && localData.id === this.$route.params.id) {
            this.data = localData;
        } else {
            localStorage[localStorage.currentPageName] = JSON.stringify(this.$route.params);
            this.data = this.$route.params;
        }
    }
};
</script>
