// 个人中心左侧栏数据
var mySideModel = new Vue({
  el: '#model-side',
  data: {
    userBaseInfo: '' // 个人用户信息
  },
  methods: {
    getUserBaseInfo: function() {
      var _this = this;

      $('#loader').fadeIn(300);
      $.ajax({
        url: headerModel.api + '/MyCenter/UserBaseInfo',
        data: {
          "token": headerModel.token
        },
        type: 'post',
        success: function(response) {
          $('#loader').fadeOut(300);
          if (response.resultid == 200) {
            _this.userBaseInfo = response;
          } else {
            console.log(response.message);
          }
        },
        error: function(e) {
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    navSlideUp: function() {
      $('.dropdown').each(function(i, el) {
        $(el).click(function() {
          $(el).addClass('dropopen').siblings().removeClass('dropopen')
        })
      })
    }
  },
  mounted: function() {
    this.getUserBaseInfo();
    this.navSlideUp();
  }
})