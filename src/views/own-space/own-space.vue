<style lang="less">
    @import './own-space.less';

    .spin-container{
    	// display: inline-block;
        position: relative;
    }
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div class="spin-container">
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="80" 
                    label-position="right"
                    :rules="validate"
                >
                    <Row>
                        <Col span="6" offset="6">
                            <FormItem label="姓名：" prop="name">
                                <div style="display:inline-block;width:100px;">
                                    <Input v-model="userForm.name" ></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="性别：">
                                <RadioGroup v-model="userForm.gender">
                                    <Radio :label="0">女</Radio>
                                    <Radio :label="1">男</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6" offset="6">
                            <FormItem label="类型：">
                                <span>{{ getElderName(userForm.elder) }}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="手机号：" prop="phone" >
                                <div style="display:inline-block;width:170px;">
                                    <Input v-model="userForm.phone"></Input>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6" offset="6">
                            <FormItem label="创建时间：">
                                <span>{{ userForm.created_at }}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="修改时间：" prop="updated_at">
                                <span>{{ userForm.updated_at }}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <!-- <Row>
                        <Col span="6" offset="6">
                            <FormItem label="登录密码：">
                                <Button type="text" size="small" @click="showPassModal">修改密码</Button>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="邮箱：" prop="email">
                                <div style="display:inline-block;width:170px;">
                                    <Input v-model="userForm.email" ></Input>
                                </div>
                            </FormItem>
                        </Col>
                    </Row> -->
                    <Row>
                        <Col span="6" offset="9">
                            <div>
                                <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                                <Button type="primary" style="width: 100px;" :loading="isSaving" @click="saveEdit">保存</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Spin size="large" fix v-if="isLoading"></Spin>
            </div>
        </Card>
        <!-- <Modal v-model="editPassModal" :closable='false' :mask-closable='false' :width="500">
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
        </Modal> -->
    </div>
</template>

<script>
import validator from '@/libs/validator';
export default {
    name: 'ownspace',
    data () {
        const { validate } = validator(this, "newPass");
        return {
            isLoading: true, // 是否正在请求数据
            isSaving: false, // 是否正在保存，控制按钮加载显示
            // 个人信息
            userForm: {
                id: '',
                phone: '',
                avatar: '',
                name: '',
                gender: 2,
                elder: '',
                created_at: '',
                updated_at: '',
            },
            // 信息验证相关
            validate,
            // 修改密码相关 password 此处简称为 pass
            // passError: '',
            // editPassModal: false, // 修改密码模态框显示
            // passForm: {
            //     pass: '',
            //     newPass: '',
            //     rePass: ''
            // }
        };
    },
    methods: {
        getElderName (elder) {
            switch (elder) {
                case 0:
                    return '儿女';
                case 1:
                    return '长者';
            }
        },
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
            this.$store.commit('removeTag', 'ownspace');
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
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.saveInfo('setUserInfo', this.userForm);
                }
            });
        },
        saveInfo (method, payload) {
            this.isSaving = true;
            this.$Message.loading({
                content: '保存中......',
                duration: 0
            });
            return this.ajax(method, payload)
                        .then(() => {
                            this.$Message.destroy();
                            this.$Message.success('保存成功');
                            this.isSaving = false;
                        })
                        .catch(() => {
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
                                this.$Message.error('保存失败');
                            }
                            this.isSaving = false;
                        });
        }
    },
    // 请求数据
    created () {
        this.ajax('getUserInfo')
            .then((data) => {
                this.userForm = data;
                this.isLoading = false;
            })
            .catch((err) => {
                this.$Message.error('数据请求失败');
            });
    }
};
</script>
