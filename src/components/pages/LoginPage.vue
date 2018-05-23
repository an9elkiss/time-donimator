<template>
  <div class="be-splash-screen">
  <div class="be-wrapper be-login">
    <div class="be-content">
      <div class="main-content container-fluid">
        <div class="splash-container">
          <div class="panel panel-default panel-border-color panel-border-color-primary">
            <div class="panel-heading"><img src="static/img/logo.png" alt="logo" width="151" height="84" class="logo-img"><span class="splash-description">A9 实验室</span></div>
            <div class="panel-body">
              <form action="index.html" method="get">
                <div class="form-group">
                  <input id="username" type="text" placeholder="用户名" autocomplete="off" class="form-control">
                </div>
                <div class="form-group">
                  <input id="password" type="password" placeholder="密码" class="form-control">
                </div>
                <div class="form-group row login-tools">
                  <div class="col-xs-12 login-forgot-password"><a href="#">忘记密码?</a></div>
                </div>
                <div class="form-group login-submit">
                  <button data-dismiss="modal" type="submit" class="btn btn-primary btn-xl">登 录</button>
                </div>
              </form>
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
export default {
  name: 'LoginPage'
}
</script>

<style scoped>

</style>
