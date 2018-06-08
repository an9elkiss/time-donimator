<template>
  <div class="be-splash-screen">
  <div class="be-wrapper be-login">
    <div class="be-content">
      <div class="main-content container-fluid">
        <div class="splash-container">
          <div class="panel panel-default panel-border-color panel-border-color-primary">
            <div class="panel-heading"><img src="static/img/logo.png" alt="logo" width="151" height="84" class="logo-img"><span class="splash-description">A9 实验室</span></div>
            <div class="panel-body">
                <div class="form-group">
                  <input id="username" type="text" placeholder="用户名" autocomplete="off" class="form-control" v-model="loginName">
                </div>
                <div class="form-group">
                  <input id="password" type="password" placeholder="密码" class="form-control" v-model="password">
                </div>
                <div class="form-group row login-tools">
                  <div class="col-xs-6 login-remember">
                    <div class="be-checkbox">
                      <label>{{errorMessage}}</label>
                    </div>
                  </div>
                  <div class="col-xs-6 login-forgot-password"><a href="#">忘记密码?</a></div>
                </div>
                <div class="form-group login-submit">
                  <button data-dismiss="modal" class="btn btn-primary btn-xl" @click="login">登 录</button>
                </div>
            </div>
          </div>
          <div class="splash-footer"><span>还没有账号? <a href="#">注册</a></span></div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Global from '@/components/Global'

export default {
  name: 'LoginPage',
  data () {
    return {
      loginName: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    login () {
      this.$http.post(Global.url.apiLogin, {loginName: this.loginName, password: this.password}).then(response => {
        if (response.body.code === 200) {
          Global.token = response.body.data.token
          this.errorMessage = ''
          this.$router.push('/')
        } else {
          this.errorMessage = response.body.message
        }
      }, response => {
        // error callback
      })
    }
  }
}
</script>

<style scoped>

</style>
