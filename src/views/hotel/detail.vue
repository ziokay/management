<style lang="less">
    @import '../../styles/common.less';

    .spin-container{
        position: relative;
    }
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                店家信息
            </p>
            <div class="spin-container">
                <Row>
                    <Col offset="7" span="9">
                        <Form 
                            ref="form"
                            :model="form" 
                            :label-width="100" 
                            label-position="right"
                            :rules="validate"
                        >
                            <Row>
                                <Col span="24">
                                    <FormItem label="店铺名称：" prop="name">
                                        <!-- <div style="display:inline-block;"> -->
                                            <Input v-model="form.name"></Input>
                                        <!-- </div> -->
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="24">
                                    <FormItem label="店铺价格：" prop="price">
                                        <!-- <div style="display:inline-block;"> -->
                                            <Input v-model="form.price"></Input>
                                        <!-- </div> -->
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="24">
                                    <FormItem label="店铺地址：" prop="address">
                                        <!-- <div style="display:inline-block;"> -->
                                            <Input v-model="form.address"></Input>
                                        <!-- </div> -->
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="24">
                                    <FormItem label="店铺类型：" prop="type">
                                        <!-- <div style="display:inline-block;"> -->
                                            <Input v-model="form.type"></Input>
                                        <!-- </div> -->
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormItem label="纬度：" prop="lng">
                                        <Input v-model="form.lng"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormItem label="经度：" prop="lat">
                                        <Input v-model="form.lat"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormItem label="适合人群：" prop="people">
                                        <!-- <div style="display:inline-block;"> -->
                                            <Input v-model="form.people"></Input>
                                        <!-- </div> -->
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormItem label="店铺简介：" prop="description">
                                        <Input
                                            v-model="form.description"
                                            type="textarea"
                                            :autosize="{minRows: 5,maxRows: 10}"
                                            placeholder="请输入......"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormItem label="其他提示：" prop="other" offset="3">
                                        <Input
                                            v-model="form.other"
                                            type="textarea"
                                            :autosize="{minRows: 5,maxRows:10}"
                                            placeholder="请输入......"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset="7">
                                    <div>
                                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                                        <Button type="primary" style="width: 100px;" :loading="isSaving" @click="saveEdit">保存</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Spin size="large" fix v-if="isLoading"></Spin>
            </div>
        </Card>
        <Modal v-model="editPassModal" :closable='false' :mask-closable='false' :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="passForm" :model="passForm" :label-width="100" label-position="right" :rules="validate">
                <FormItem label="原密码" prop="pass" :error="passError">
                    <Input type="password" v-model="passForm.pass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input type="password" ref="newPass" v-model="passForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input type="password" v-model="passForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="closePassModal">取消</Button>
                <Button type="primary" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import validator from '@/libs/validator';
export default {
    name: 'hotel-detail',
    data () {
        const { validate } = validator(this, "newPass");
        return {
            isLoading: true, // 是否正在请求数据
            isSaving: false, // 是否正在保存，控制按钮加载显示
            // 信息
            form: {
                name: '',
                description: '',
                address: '',
                lng: '',
                lat: '',
                people: '',
                type: 0,
                price: '',
                other: ''
            },
            // 信息验证相关
            validate,
            // 修改密码相关 password 此处简称为 pass
            passError: '',
            editPassModal: false, // 修改密码模态框显示
            passForm: {
                pass: '',
                newPass: '',
                rePass: ''
            }
        };
    },
    methods: {
        // 密码模态框相关
        showPassModal () {
            this.editPassModal = true;
        },
        closePassModal () {
            this.editPassModal = false;
        },
        saveEditPass () {
            this.$refs['passForm'].validate((valid) => {
                if (valid) {
                    this.saveInfo('setPass', this.passForm);
                    this.closePassModal();
                    this.$refs['passForm'].resetFields();
                }
            });
        },
        // 取消与保存事件
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'hotel-detail');
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
        saveEdit () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.isSaving = true;
                    this.$Message.loading({
                        content: '保存中......',
                        duration: 0
                    });
                    return this.ajax('setHotelInfo', { data: this.form })
                                .then(() => {
                                    this.$Message.destroy();
                                    this.$Message.success('保存成功');
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
                                    } else if (err.response.status === 422) {
                                        this.$Message.error('店铺名称未更改');
                                    } else {
                                        this.$Message.error('保存失败');
                                    }
                                    this.isSaving = false;
                                });
                }
            });
        }
    },
    activated () {
        this.ajax('getHotelInfo')
            .then((data) => {
                this.form = data;
                this.isLoading = false;
            })
            .catch((err) => {
                this.$Message.error('数据请求失败');
            });
    }
};
</script>
