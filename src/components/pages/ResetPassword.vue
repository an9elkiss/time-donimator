<template>
  <div class="be-splash-screen">
    <div class="be-wrapper be-login">
      <div class="be-content">
        <div class="main-content container-fluid">
          <div class="splash-container">
            <div class="panel panel-default panel-border-color panel-border-color-primary">
              <div class="panel-heading panel-heading-divider">重置密码</div>
              <div class="panel-body">
                <form
                  action="#"
                  data-parsley-validate=""
                  novalidate=""
                >
                  <div class="form-group">
                    <label>旧密码</label>
                    <input
                      type="password"
                      placeholder="Old password"
                      required=""
                      v-model="oldPassword"
                      class="form-control"
                    >
                  </div>
                  <div class="form-group">
                    <label>新密码</label>
                    <input
                      id="pass1"
                      type="password"
                      placeholder="New password"
                      required=""
                      v-model="newPassword"
                      class="form-control"
                    >
                  </div>
                  <div class="form-group">
                    <label>再次输入新密码</label>
                    <input
                      data-parsley-equalto="#pass1"
                      type="password"
                      required=""
                      v-model="repeatNewPassword"
                      placeholder="Repeat new password"
                      class="form-control"
                    >
                  </div>
                  <span class="highlight">{{errorMessage}}</span>
                  <p class="text-right">
                    <button
                      type="submit"
                      class="btn btn-space btn-primary"
                      @click="resetPassword"
                    >重置</button>
                    <button
                      class="btn btn-space btn-default"
                      @click="$router.go(-1)"
                    >取消</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import { Dialog } from 'vant'

export default {

  data () {
    return {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
      errorMessage: ''
    }
  },

  methods: {
    resetPassword () {
      var pwdreg = /^(?![^A-Za-z]+$)(?![^0-9]+$)(?=.*[^\w\s]+).{6,12}$/
      if (this.oldPassword.length < 6 || this.newPassword < 6 || this.repeatNewPassword < 6) {
        this.errorMessage = '请注意：密码必须大于6位'
        return
      } else if (this.newPassword !== this.repeatNewPassword) {
        this.errorMessage = '请注意：新密码与第二次输入的密码不同'
        return
      } else if (!pwdreg.test(this.newPassword)) {
        this.errorMessage = '请注意：新密码必须由数字、字母、特殊符号组成'
        return
      }
      this.$http.post(Global.url.apiResetPassword, { oldPassword: this.oldPassword, newPassword: this.newPassword, repeatNewPassword: this.repeatNewPassword }).then(response => {
        if (response.body.code === 200) {
          Dialog.confirm({
            title: '提示',
            message: '修改密码成功，需要重新登录，是否跳转到登录页面？'
          }).then(async () =>
            this.$router.push({ name: 'LoginPage' }))
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
.highlight {
  color: #ff0000;
}
</style>
