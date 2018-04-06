<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    商家登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" >
                        <FormItem prop="userName">
                            <Input v-model="form.phone" placeholder="请输入电话号码">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button :loading="loginLoading" @click="handleSubmit" type="primary" long>登录</Button>                  
                            <!-- <Button :loading="loginLoading" @click="toSignupPage" type="primary" style="margin-left: 36px">注册</Button> -->
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入11位电话号码及6位数密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import validator from '@/libs/validator';
export default {
    data () {
        const { validate } = validator(this, "newPass");
        return {
            form: {
                phone: '',
                password: ''
            },  
            rules: {
                phone: [
                    { validator: validate, trigger: 'blur' },
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            },
            loginLoading: false
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loginLoading = true;
                    this.$Message.loading({
                        content: '登录中......',
                        duration: 0
                    });
                    this.ajax('login', this.form)
                        .then(data => {
                            return this.ajax('getUserInfo');
                        })
                        .then(data => {
                            this.$Message.destroy();
                            this.$Message.success('登录成功');
                            if (data.hotel) {
                                this.$router.push({
                                    name: 'home_index',
                                    params: data
                                });
                            } else {
                                this.$router.push({
                                    name: 'signup'
                                });
                            }
                            this.loginLoading = false;
                        })
                        .catch(err => {
                            this.$Message.destroy();
                            this.$Message.warning({
                                content: '账号或密码有误，请重新输入',
                                duration: 3
                            });
                            this.form.password = '';
                            this.loginLoading = false;
                        });
                }
            });
        }
    }
};
</script>
