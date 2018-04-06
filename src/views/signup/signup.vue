<style lang="less">
  @import './signup.less';
</style>

<template>
  <div class="reg" @keydown.enter="handleSubmit">
    <div class="reg-con">
      <Card :bordered="false">
        <p slot="title">
            <Icon type="log-in"></Icon>
            商家注册
        </p>
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
          <FormItem label="店铺经度" prop="lng">
            <Input v-model="form.lng" placeholder="请输入店铺经度"></Input>
          </FormItem>
          <FormItem label="店铺纬度" prop="lat">
            <Input v-model="form.lat" placeholder="请输入店铺维度"></Input>
          </FormItem>
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
              <Button type="primary" @click="handleSubmit('form')" :loading="isSaving">注册</Button>
              <Button type="ghost" @click="handleReset('form')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </div>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signup',
  data () {
    return {
      form: {
        name: '',
        description: '',
        address: '',
        lng: '',
        lat: '',
        people: '',
        price: '',
        type: 0,
        other: '',
        doc: null
      },
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
      },
      isSaving: false
    }
  },
  methods: {
    deleteFile () {
      this.form.doc = null;
    },
    addFile (file) {
      this.form.doc = file;
      return false;
    },
    handleSubmit (name) {
      this.isSaving = true;
      this.$Message.loading({
          content: '注册中......',
          duration: 0
      });
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.ajax('signup', this.form)
              .then(data => {
                this.$Message.destroy();
                this.$Message.success('注册成功！');
                this.$router.push('/home');
                this.isSaving = false;
              })
              .catch(err => {
                this.$Message.destroy();
                this.$Message.warning({
                    content: '注册失败，请检查信息填写是否完整！',
                    duration: 3
                });
                this.isSaving = false;
              });
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
      this.deleteFile();
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '文件格式不正确',
            desc: '文件 ' + file.name + ' 格式不正确，请上传 zip 格式的文件。'
        });
    }
  }
}
</script>
