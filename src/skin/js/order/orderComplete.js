var orderCompleteModel = new Vue({
  el: '#model-orderComplete',
  data: {
    orderInfo: '',
    orderId: ''
  },
  methods: {
    getOrderInfo: function () {
      var _this = this;
      $('#loader').fadeIn(300);
      this.$http.get(headerModel.api + '/Order/GetOrder?orderid=' + _this.orderId).then(function (response) {
        $('#loader').fadeOut(300);
        _this.orderInfo = response.data;
      })
    }
  },
  mounted: function  () {
    this.orderId = window.location.search.split('orderId=')[1] || 0;
    console.log(this.orderId);
    if (!this.orderId) {
      window.location.href="../project/index.html"
    }
    this.getOrderInfo();
  }
})