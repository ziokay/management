<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                店铺信息
            </p>
            <div>
                <Form ref="userForm" :model="userForm" :label-width="100" label-position="right" :rules="inforValidate">
                    <Row>
                        <Col span="6">
                        <FormItem label="店铺名称：" prop="name">
                            <div style="display:inline-block;width:150px;">
                                <Input v-model="userForm.name"></Input>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="6" offset="4">
                        <FormItem label="店铺地址：" prop="address">
                            <div style="display:inline-block;width:150px;">
                                <Input v-model="userForm.address"></Input>
                            </div>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem label="适合人群：" prop="people">
                            <div style="display:inline-block;width:150px;">
                                <Input v-model="userForm.people"></Input>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="6" offset="4">
                        <FormItem label="店铺价格：" prop="price">
                            <div style="display:inline-block;width:150px;">
                                <Input v-model="userForm.price"></Input>
                            </div>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem label="店铺类型：" prop="type">
                            <div style="display:inline-block;width:150px;">
                                <Input v-model="userForm.type"></Input>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="6" offset="4">
                        <FormItem label="店铺简介：" prop="description">
                            <div style="display:inline-block;width:250px;">
                                <Input v-model="userForm.description"></Input>
                            </div>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem label="其他提示：" prop="other">
                            <div style="display:inline-block;width:150px;">
                                <!-- <Upload multiple action="postInfo"
                                :show-upload-list="true"
                                :format="['zip']"
                                :on-format-error="handleFormatError2"
                                >
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                    <p>仅支持zip格式文件</p>
                                </Upload> -->

                                <Upload multiple action="">
                                    <!-- <span>多选文件上传&nbsp;&nbsp;</span> -->
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                            </div>

                            <!-- <div class="height-120px">
                            </div> -->

                        </FormItem>
                    </Row>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'ownspace_index',
        data() {
            const validePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            return {
                userForm: {
                    name: '',
                    address: '',
                    people: '',
                    price: '',
                    type: '',
                    description: '',
                },
                uid: '', // 登录用户的userId
                phoneHasChanged: false, // 是否编辑了手机
                save_loading: false,
                savePassLoading: false,
                oldPassError: '',
                // uploadList: [],
                inforValidate: {
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    address: [{
                        required: true,
                        message: '店铺地址不能为空',
                        trigger: 'blur'
                    }],
                    people: [{
                        required: true,
                        message: '适应人群不能为空',
                        trigger: 'blur'
                    }],
                    price: [{
                        required: true,
                        message: '店铺价格不能为空',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: '店铺类型不能为空',
                        trigger: 'blur'
                    }],
                    description: [{
                        required: true,
                        message: '店铺简介不能为空',
                        trigger: 'blur'
                    }],
                },
            };
        },
        methods: {
            cancelEditUserInfor() {
                this.$store.commit('removeTag', 'ownspace_index');
                localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
                let lastPageName = '';
                if (this.$store.state.app.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.app.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.app.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            },
            saveEdit() {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if (this.phoneHasChanged && this.userForm.cellphone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                            if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                                if (this.identifyCodeRight) { // 判断验证码是否正确
                                    this.saveInfoAjax();
                                } else {
                                    this.$Message.error('验证码错误，请重新输入');
                                }
                            } else {
                                this.$Message.warning('请先点击获取验证码');
                            }
                        } else {
                            this.saveInfoAjax();
                        }
                    }
                });
            },
            // init() {
            //     this.userForm.name = 'Lison';
            //     this.userForm.cellphone = '17712345678';
            //     this.initPhone = '17712345678';
            //     this.userForm.company = 'TalkingData';
            //     this.userForm.department = '可视化部门';
            // },





            //     handleFormatError (file) {
            //     this.$Notice.warning({
            //         title: '文件格式不正确',
            //         desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
            //     });
            // },
            // handleBeforeUpload (file) {
            //     this.$Notice.warning({
            //         title: '文件准备上传',
            //         desc: '文件 ' + file.name + ' 准备上传。'
            //     });
            // },
            // handleProgress (event, file) {
            //     this.$Notice.info({
            //         title: '文件正在上传',
            //         desc: '文件 ' + file.name + ' 正在上传。'
            //     });
            // },
            // handleSuccess (evnet, file) {
            //     this.$Notice.success({
            //         title: '文件上传成功',
            //         desc: '文件 ' + file.name + ' 上传成功。'
            //     });
            // },
            // handleError (event, file) {
            //     this.$Notice.error({
            //         title: '文件上传成功',
            //         desc: '文件 ' + file.name + ' 上传失败。'
            //     });
            // },
            // handleView (name) {
            //     this.imgName = name;
            //     this.visible = true;
            // },
            handleRemove(file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            // handleSuccess2 (res, file) {
            //     // 因为上传过程为实例，这里模拟添加 url
            //     file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            //     file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            // },
            handleFormatError2(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 zip 格式的文件。'
                });
                // return check;  
            }
        },
        mounted() {
            // this.uploadList = this.$refs.upload.fileList;
        },
        created() {
            // this.ajax()
            //     .getInfo()
            //     .catch((err) => {
            //         this.$Message.error('数据请求失败');
            //     })
            //     .then((data) => {
            //         this.userForm = data;
            //         // this.isLoading = false;
            //     });
        }
    }
</script>