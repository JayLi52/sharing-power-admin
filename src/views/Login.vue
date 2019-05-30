<template>
  <div class="v-bg">
    <a-modal title="登录" v-model="centerDialogVisible" width="400px" style="width:300px!important" :maskClosable="false" center :show-close="false" :modal="false" :closable="false" class="login-modal">
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol" label='邮箱' fieldDecoratorId="email" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入邮箱地址'}],initialValue:email}">
          <a-input placeholder='请输入邮箱地址' />
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol" label='密码' fieldDecoratorId="password" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }],initialValue:password}">
          <a-input placeholder='请输入密码' type="password" />
        </a-form-item>
        <a-form-item :labelCol="formTailLayout.labelCol" :wrapperCol="formTailLayout.wrapperCol" style="margin-bottom:0">
          <a-checkbox v-model="memory" @change="memory!=memory">
            记住密码
          </a-checkbox>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button type='primary' @click="check" style="width:100%" size="large" :loading="loading">登录</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18, offset: 6 }
}
export default {
  data () {
    return {
      memory: true,
      formItemLayout,
      formTailLayout,
      centerDialogVisible: true,
      loading: false,
      email: 'admin@admin.com',
      password: 'admin'
    }
  },
  computed: {
    menu () {
      return this.$store.state.sys.menu
    }
  },
  methods: {
    check () {
      this.$router.push('/Index')
    }
  }
}
</script>

<style lang="postcss" scoped>
.v-bg {
  height: 100%;
  min-height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-image: url('../assets/fullstack.jpg');
}
.login-modal {
  .ant-modal-body {
    padding-bottom: 0 !important;
  }
}
canvas {
  display: block;
  /* vertical-align: bottom; */
} /* ---- particles.js container ---- */
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: none;
  background-image: url('');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
} /* ---- stats.js ---- */
.count-particles {
  background: #000022;
  position: absolute;
  top: 48px;
  left: 0;
  width: 80px;
  color: #13e8e9;
  font-size: 0.8em;
  text-align: left;
  text-indent: 4px;
  line-height: 14px;
  padding-bottom: 2px;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
}
.js-count-particles {
  font-size: 1.1em;
}
#stats,
.count-particles {
  -webkit-user-select: none;
  margin-top: 5px;
  margin-left: 5px;
}
#stats {
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}
.count-particles {
  border-radius: 0 0 3px 3px;
}
</style>
