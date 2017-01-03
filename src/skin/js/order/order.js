var orderModel = new Vue({
  el: '#model-order',
  data: {
    proId: '',
    buyInfo: '',
    part: '1', // 认投份数
    selected: '0', // 选择的coupon
    amount:0 // 认投金额
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
              _this.amount = response.project.OriginalLowVote;
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
    // 禁用非数字型
    numEv: function (e) {
      return DGDTOOLS.check._isNumPoint(e)
    },
    // 检测转入是否规范
    numCh: function () {
      var _this = this;
      if (this.amount == '' || this.amount < this.buyInfo.project.OriginalLowVote - 0) {
        this.amount = this.buyInfo.project.OriginalLowVote;
        DGDTOOLS.tip._tip('金额必须大于最低跟投小于最高跟投',function () {
          _this.$refs.amount.focus()
        })
      }
    },
    couponCh: function () {
      var _this = this;

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
    // ManagerFee 管理费
    manageFree: function () {
      var res = 0
      if (this.orderRule) {
        return (this.buyInfo.ProjectRule.ManagerFee * this.amount).toFixed(2);
      }
    },
    // 计算coupon
    coupon: function () {
      var res = 0;
      for (var i = 0; i < buyInfo.project.ProjectID.length; i++) {
        if (buyInfo.project.ProjectID[i].CouponId == selected) {
          return res = buyInfo.project.ProjectID[i].Amount;
        }
      }
      return res
    }
  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.proId = window.location.search.split('id=')[1] || 0;
    // this.proId = '1037' // 有规则(按份数)
    // this.proId = '1034' // 有规则(按份数)
    // this.proId = '1272' // 无规则
    this.getBuyInfo();
  }
})
