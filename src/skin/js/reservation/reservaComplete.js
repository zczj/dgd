/**
 * 预约项目
 */

var reservaModel = new Vue({
  el: '#model-reserva',
  data: {
    proId: '',
    buyInfo: '',
    TimesRotation: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'], // 众筹轮次
  },
  methods: {
    getBuyInfo: function () {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {
        ;
        DGDTOOLS.check._isLogin();
        return;
      } else {
        $('#loader').fadeIn(300);
        $.ajax({
          url: headerModel.api + '/Buy/BuyInfo',
          data: {
            "id": _this.proId,
            "token": headerModel.token
          },
          type: 'post',
          success: function (response) {
            $("#loader").fadeOut(300);
            if (response.resultid == 200) {
              _this.buyInfo = response;
              _this.amount = response.project.OriginalLowVote;
            } else {
              console.log(response.message);
            }
          },
          error: function (e) {
            console.error(e.status + ":" + e.responseText);
          }
        })
      }
    }
  },
  mounted: function () {   
    this.proId = window.location.search.split('proId=')[1] || 0;
    console.log(this.proId);
    if (!this.proId) {
      window.location.href="../project/index.html"
    }
    this.getBuyInfo();
  }
})