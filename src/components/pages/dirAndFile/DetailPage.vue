<template>
  <div class="be-content be-no-padding">
    <aside class="page-aside">
      <div class="be-scroller ps-container ps-theme-default" data-ps-id="b124edcf-6d2e-2d3a-d91e-79464c55e4d4">
        <div class="aside-content">
          <div class="content">
            <div class="aside-header">
              <button data-target=".aside-nav" data-toggle="collapse" type="button" class="navbar-toggle"><span class="icon mdi mdi-caret-down"></span></button><span class="title">Mail Service</span>
              <p class="description">Service description</p>
            </div>
          </div>
          <div class="aside-nav collapse">
            <ul class="nav">
              <li><a href="#"><span class="label label-primary">8</span><i class="icon mdi mdi-inbox"></i> Inbox</a></li>
              <li class="active"><a href="#"><i class="icon mdi mdi-email"></i> Sent Mail</a></li>
              <li><a href="#"><span class="label label-default">4</span><i class="icon mdi mdi-case"></i> Important</a></li>
              <li><a href="#"><i class="icon mdi mdi-file"></i> Drafts</a></li>
              <li><a href="#"><i class="icon mdi mdi-star"></i> Tags</a></li>
              <li><a href="#"><i class="icon mdi mdi-delete"></i> Trash</a></li>
            </ul><span class="title">Labels</span>
            <ul class="nav nav-pills nav-stacked">
              <li><a href="#"><span class="label label-success">0</span> Inbox</a></li>
              <li><a href="#"><span class="label label-danger">8</span>Sent Mail</a></li>
              <li><a href="#"><span class="label label-warning">4</span>Important</a></li>
            </ul>
            <div class="aside-compose"><a class="btn btn-lg btn-primary btn-block">Compose Email</a></div>
          </div>
        </div>
        <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 0px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 0px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
    </aside>
    <div class="be-wrapper be-aside be-fixed-sidebar">
      <div class="main-content container-fluid">
        <div class="email-body">
          <div class="col-md-12">
            <div class="panel">
              <div class="panel-heading panel-heading-divider">Body text<span class="panel-subtitle">张三&nbsp;&nbsp;2018-07-09</span></div>
              <div class="panel-body">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ornare iaculis purus, eget gravida est lacinia at. Nam magna dolor, vestibulum ut consequat in, dictum a metus.</p>
                <p>Pellentesque vulputate arcu sed risus auctor tincidunt. Morbi eget massa turpis. Fusce aliquet dolor eu posuere tincidunt. Fusce ultricies luctus dui, dapibus pharetra risus semper non. Maecenas tempus est neque, sit amet malesuada augue tempor vitae. Proin mattis efficitur enim ut molestie.</p>
              </div>
            </div>
          </div>
          <div class="box-fixed center">
            <a class="btn btn-space btn-primary btn-add">上一篇</a>
            <a class="btn btn-space btn-primary btn-add">返&nbsp;&nbsp;&nbsp;&nbsp;回</a>
            <a class="btn btn-space btn-primary btn-add">下一篇</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailPage'
}
</script>

<style scoped>
  .email-body {
    padding: 10px 0px;
  }
  .panel-heading-divider {
    text-align: center;
  }
  div.be-wrapper.be-aside.be-fixed-sidebar {
    padding-top: 0px;
  }
</style>
