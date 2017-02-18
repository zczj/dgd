var homeModel = new Vue({
  el: '#home',
  name: 'home',
  data: {
    standGuardInfo: '', // 站岗宝信息
  },
  methods: {
    // 获取站岗宝信息
    getStandGuardInfo: function() {
      var _this = this;
      $('#loader').fadeIn(300);

      $.ajax({
        url: headerModel.api + '/MyCenter/GetStandGuardInfo',
        data: {
          "currentpage": 1,
          "pagesize": 10,
          "token": headerModel.token
        },
        type: 'POST',
        success: function(res) {
          $('#loader').fadeOut(300);
          if (res.resultid == 200) {
            _this.standGuardInfo = res;
          }
        }
      })
    }
  },
  mounted: function() {
    document.getElementById('loader').style.display = 'none';
    this.getStandGuardInfo();
  }
});