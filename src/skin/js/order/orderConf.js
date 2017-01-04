var orderConfModel = new Vue({
  el: '#model-orderConf',
  data: {
    orderInfo: '',
    orderId: 0
  },
  methods: {
    getOrderInfo: function () {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {;
        DGDTOOLS.check._isLogin();
        return;
      } else{
        $('#loader').fadeIn(300);
        this.$http.get(headerModel.api + '/Order/GetOrder?orderid='+_this.orderId).then(function (response) {
          $('#loader').fadeOut(300);
          _this.orderInfo = response.data;
          console.log(_this.orderInfo);
          console.log(response);
        })
      }
    }
  },
  computed: {

  },
  mounted: function () {
    this.orderId = window.location.search.split('orderId=')[1] || 0;
    this.getOrderInfo();
    console.log(this.orderId);
  }
})