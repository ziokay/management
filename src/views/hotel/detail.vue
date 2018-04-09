<style lang="less">
    @import '../../styles/common.less';

    .spin-container{
        position: relative;
    }
</style>

<template>
    <Card>
        <p slot="title">
            <Icon type="person"></Icon>
            店家信息
        </p>
        <div class="spin-container">
            <Row>
                <Col :sm="{ offset: 1, span: 22 }" :lg="{ offset: 6, span: 12 }">
                    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80" inline>
                        <FormItem label="店铺名称" prop="name">
                            <Input v-model="form.name" placeholder="请输入店铺名称"></Input>
                        </FormItem>
                        <FormItem label="店铺地址" prop="address">
                            <Input v-model="form.address" placeholder="请输入店铺地址"></Input>
                        </FormItem>
                        <FormItem label="适合人群" prop="people">
                            <Input v-model="form.people" placeholder="请输入适合人群"></Input>
                        </FormItem>
                        <FormItem label="店铺价格" prop="price">
                            <Input v-model="form.price" placeholder="请输入店铺价格"></Input>
                        </FormItem>
                        <!-- <FormItem label="店铺经度" prop="lng">
                            <Input v-model="form.lng" placeholder="请输入店铺经度"></Input>
                        </FormItem>
                        <FormItem label="店铺纬度" prop="lat">
                            <Input v-model="form.lat" placeholder="请输入店铺维度"></Input>
                        </FormItem> -->
                        <FormItem label="店铺类型">
                            <i-switch v-model="form.type" size="large" :true-value="1" :false-value="0">
                                <span slot="open">1</span>
                                <span slot="close">0</span>
                            </i-switch>
                        </FormItem>
                        <FormItem label="店铺简介" prop="description" style="width: 95%;">
                            <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入店铺简介"></Input>
                        </FormItem>
                        <FormItem label="其他提示"  prop="other" style="width: 95%;">
                            <Input v-model="form.other" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入其它提示"></Input>
                        </FormItem>
                        <FormItem label="附件上传">
                            <div style="display:inline-block;width:250px;">
                                <Upload
                                    action=""
                                    :before-upload="addFile"
                                    ref="upload"
                                    :show-upload-list="false"
                                    :format="['zip']"
                                    :on-format-error="handleFormatError"
                                >
                                    <Button type="ghost" icon="ios-cloud-upload-outline" style="margin-right: 8px">上传文件</Button>
                                    <span>仅支持zip格式文件</span>
                                </Upload>
                            </div>
                        </FormItem>
                        <div style="text-align: center; margin-left: -80px;">
                            <FormItem style="margin: 5px;">
                            <Button type="primary" @click="cancelEditUserInfor" :loading="isSaving">取消</Button>
                            <Button type="ghost" @click="saveEdit('form')" style="margin-left: 8px">保存</Button>
                            </FormItem>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Spin size="large" fix v-if="isLoading"></Spin>
        </div>
    </Card>
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
                other: '',
                doc: null
            },
            // 信息验证相关
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: '店铺名称不能为空',
                        trigger: 'blur'
                    }
                ],
                address: [
                    {
                        required: true,
                        message: '店铺地址不能为空',
                        trigger: 'blur'
                    }
                ],
                people: [
                    {
                        required: true,
                        message: '适合人群不能为空',
                        trigger: 'blur'
                    }
                ],
                price: [
                    {
                        required: true,
                        message: '店铺价格不能为空',
                        trigger: 'blur'
                    }
                ],
                lng: [
                    {
                        required: true,
                        message: '店铺经度不能为空',
                        trigger: 'blur'
                    }
                ],
                lat: [
                    {
                        required: true,
                        message: '店铺纬度不能为空',
                        trigger: 'blur'
                    }
                ],
                description: [
                    {
                        required: true,
                        message: '店铺简介不能为空',
                        trigger: 'blur'
                    }
                ],
                other: [
                    {
                        required: true,
                        message: '其它提示不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        deleteFile () {
            this.form.doc = null;
        },
        addFile (file) {
            this.form.doc = file;
            return false;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 zip 格式的文件。'
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
        saveEdit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.isSaving = true;
                    this.$Message.loading({
                        content: '保存中......',
                        duration: 0
                    });
                    return this.ajax('setHotelInfo', this.form)
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
                for (const key in this.form) {
                    if (this.form.hasOwnProperty(key)) {
                        this.form[key] = data[key];
                    }
                }
                if(!this.form.doc) {
                    this.form.doc = null;
                }
                this.isLoading = false;
            })
            .catch((err) => {
                this.$Message.error('数据请求失败');
            });
    }
};
</script>
