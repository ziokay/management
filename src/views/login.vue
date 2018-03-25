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
                            <Button @click="handleSubmit" type="primary" style="margin-left: 50px">登录</Button>                  
                            <Button @click="registerSubmit" type="primary" style="margin-left: 36px">注册</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入11位电话号码及6位数密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
const validateMobile = (rule, value, callback) => {
    if(!Number.isInteger(+value)) {
                    callback(new Error('请输入手机号'));
                } else if(value.length==11){
                    callback();
                }else{
                  callback(new Error('请输入正确的手机号'))
                }  
  }
export default {
    data () {
        return {
            form: {
                phone: '',
                password: ''
            },  
            rules: {
                phone: [
                    { required: true, message: '账号不能为空', trigger: 'blur' },
                    {validator: validateMobile, trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.ajax.login({ phone: this.form.phone, password: this.form.password })
                            .then((data) => {
                                Cookies.set('user', this.form.phone);
                                Cookies.set('password', this.form.password);
                                Cookies.set('access', 1);
                                this.$router.push({
                                    name: 'home_index'
                                });
                            });
                }
            });
        },
        registerSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    Cookies.set('user', this.form.phone);
                    Cookies.set('password', this.form.password);
                    if (this.form.phone === 'iview_admin') {
                        Cookies.set('access', 0);
                    } else {
                        Cookies.set('access', 1);
                    }
                    this.$router.push({
                        name: 'register'
                    });
                }
            });
        }
    }
};
</script>

<style>

</style>
