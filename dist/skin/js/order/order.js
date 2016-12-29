var orderModel = new Vue({
  el: '#model-order',
  data: {
    proId: '',
    buyInfo: '',
    part: 1, // 认投份数
    selected: '' // 选择的coupon
  },
  methods: {
    getBuyInfo: function () {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {;
        DGDTOOLS.check._isLogin();
        return;
      }else{
        $('#loader').fadeIn(300);
        $.ajax({
          url: headerModel.api +'/Buy/BuyInfo',
          data: {
            "id": _this.proId,
            "token": headerModel.token
          },
          type: 'post',
          success: function (response) {
            $("#loader").fadeOut(300);
            console.log(response);
            if (response.resultid == 200) {
              _this.buyInfo = response;
              _this.selected = response.CouponList[0].CouponID;
            }
            else{
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
  computed: {

  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.proId = window.location.search.split('id=')[1] || 0;
    this.proId = '1037'
    this.getBuyInfo();
  }
})
