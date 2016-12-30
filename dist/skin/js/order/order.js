var orderModel = new Vue({
  el: '#model-order',
  data: {
    proId: '',
    buyInfo: '',
    part: '1', // 认投份数
    selected: '0' // 选择的coupon
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
            if (response.resultid == 200) {
              _this.buyInfo = response;
              response.CouponList =[{Amount:0,CouponID:0}].concat(response.CouponList)
              // _this.selected = response.CouponList[0]?response.CouponList[0].CouponID:_this.selected;
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
    },
    numEv: function (e) {
      this.amount = this.amount ==''?1:this.amount;
      return DGDTOOLS.check._isNumPoint(e)
    }
  },
  computed: {
    /**
     * 是否有订单规则
     * @Author: 老苏
     * @return  {boolen} 布尔值
     */
    orderRule: function () {
      return this.buyInfo.ProjectRule;
    },
    /**
     * 计算总金额
     * @Author: 老苏
     * @return  {[type]} [description]
     */
    totleResult: function () {
      var res = 0;
      return res;
    },
    // 认投金额
    amount: function () {
      return this.buyInfo.project.OriginalLowVote;
    },
    // ManagerFee 管理费
    manageFree: function () {
      return (this.buyInfo.ProjectRule.ManagerFee * this.buyInfo.project.OriginalLowVote).toFixed(2);
    },
    // Coupon
    coupon: function () {
      var res = 0;
      for (var i = 0; i < this.buyInfo.CouponList.length; i++) {
        if (this.buyInfo.CouponList[i].id=this.selected) {
          return res = this.buyInfo.CouponList[i].Amount
        }
      }
      return res;
    }
  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.proId = window.location.search.split('id=')[1] || 0;
    // this.proId = '1037' // 有规则
    // this.proId = '1272' // 无规则
    this.getBuyInfo();
  }
})
