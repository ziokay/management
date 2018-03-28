<style lang="less">
  @import './signup.less';
</style>
<!-- <style scoped>
  .reg {
    width: 500px;
    margin: 80px auto;
    padding: 20px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    background-color: #F9FAFC;
    /* color: black; */
  }

  h2 {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 15px;
    /* color: black; */
  }

</style> -->


<template>
  <div class="register">
  <div class="reg">
    <h2>商家注册</h2>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="店铺名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入店铺名称"></Input>
      </FormItem>
      <FormItem label="店铺地址" prop="address">
        <Input v-model="formValidate.address" placeholder="请输入店铺地址"></Input>
      </FormItem>
      <FormItem label="适合人群" prop="elder">
        <Input v-model="formValidate.elder" placeholder="请输入适合人群"></Input>
      </FormItem>
      <FormItem label="店铺价格" prop="price">
        <Input v-model="formValidate.price" placeholder="请输入店铺价格"></Input>
      </FormItem>
      <FormItem label="店铺类型" prop="type">
        <Input v-model="formValidate.type" placeholder="请输入店铺价格"></Input>
      </FormItem>
      <FormItem label="店铺简介" prop="intro">
        <Input v-model="formValidate.intro" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入店铺简介"></Input>
      </FormItem>
      <FormItem label="其他提示："  prop="other">
          <div style="display:inline-block;width:150px;">
              <Upload multiple action=""
              ref="upload"
              :show-upload-list="false"
              :format="['zip']"
              :on-format-error="handleFormatError2"
              >
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                  <p>仅支持zip格式文件</p>
              </Upload>
          </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      formValidate: {
        name: '',
        address: '',
        elder: '',
        price: '',
        type: '',
        intro: '',
      },
      uploadList: [],
      ruleValidate: {
        name: [{
          required: true,
          message: '店铺名称不能为空',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '店铺地址不能为空',
          trigger: 'blur'
        }],
        elder: [{
          required: true,
          message: '适合人群不能为空',
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
        intro: [{
          required: true,
          message: '店铺简介不能为空',
          trigger: 'blur'
        }],
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('注册成功！');
          this.$router.push('/home');
        } else {
          this.$Message.error('请将信息填写完整！');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleRemove (file) {
          // 从 upload 实例删除数据
          const fileList = this.$refs.upload.fileList;
          this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleFormatError2 (file) {
          this.$Notice.warning({
              title: '文件格式不正确',
              desc: '文件 ' + file.name + ' 格式不正确，请上传 zip 格式的文件。'
          });
      },
  },
  mounted() {
          this.uploadList = this.$refs.upload.fileList;
      }
}
</script>
