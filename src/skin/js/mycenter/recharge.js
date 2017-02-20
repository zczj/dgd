var rechargeModel = new Vue({
  el: '#rechargeM',
  data: {
    list: '',
    tmoney: '0',
    payLine: 1, // 在线支付方式
    /**
     * {'bankcode': '005','bankName': '富友支付'}
     * {'bankcode': '006','bankName': '宝付支付'}
     */
    payLineMap: DGDTOOLS.VAR._payType(),
    payLock: false,
  },
  methods: {
    // 银行卡
    getMyBack: function () {
      var _this = this;
      $.ajax({
        url: headerModel.api + '/MyCenter/MyBankCardForPC',
        data: {
          "Token": headerModel.token,
          "iswap": _this.isWap,
        },
        type: 'post',
        success: function (response) {
          $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            _this.list = response.response;
            if (!_this.list.length && _this.isWap) {
              DGDTOOLS.tip._tip('未绑卡', function () {

                // window.location.href="bindCard.html"
              });
            }
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          $("#loader").fadeOut(300)
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    checkPoint: function () {
      var _this = this;
      console.log(_this.tmoney)
      if (_this.tmoney.indexOf('.') == '-1') {
        return
      }
      if (_this.tmoney.split('.').length > 2) {
        _this.tmoney = _this.tmoney.split('.')[0]
      }
    },
    checkInput: function () {
      //
      var _this = this;
      if (_this.tmoney < 100) {
        DGDTOOLS.tip._tip('提现金额不能小于100元', function () {

          _this.$refs.tmoney.focus()
        })
        return true;
      }
      if (_this.pwd == '') {
        DGDTOOLS.tip._tip('交付密码不能为空', function () {

          _this.$refs.pwd.focus()
        })
        return true;
      }

      return false;
    },
    /**
     * 1.1 mobile: 走接口：‘/Order/AddRecharge’
     * 1.2 pc: 走控制器：‘空缺'
     */
    addRecharge: function () {
      var _this = this,
        url, rechargeData;
      if (_this.payLock) {
        return;
      } else {
        _this.payLock = true;
      }
      headerModel.loading = true;
      if (_this.isWap) {
        console.log(_this.payLineMap[_this.payLine])
        url = headerModel.api + '/Order/AddRecharge';
        rechargeData = {
          "token": headerModel.token,
          "Amount": _this.tmoney,
          "PayType": 1, // 固定接口走
          "orderid": ""
        }
      } else {
        rechargeData = {
          "token": headerModel.token,
          "Amount": _this.tmoney,
          "PayType": _this.payLineMap[_this.payLine].bankcode,
          "AssociatedBank": _this.payLineMap[_this.payLine].bankName,
          "orderid": ""
        }
        console.log(rechargeData)
        _this.payLock = false;
        headerModel.loading = false;
        DGDTOOLS.tip._tip('控制器空缺')
        return;
      }

      $.ajax({
        url: url,
        data: rechargeData,
        type: 'post',
        success: function (response) {
          headerModel.loading = false;
          _this.payLock = false;
          if (response.resultid == 200) {
             DGDTOOLS.tip._tip('充值成功但无SDK跳转！')
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          headerModel.loading = false;
          _this.payLock = false;
          console.error(e.status + ":" + e.responseText);
        }
      })

    }
  },
  computed: {
    isWap: function () {
      /**
       * false : pc
       * false : wap
       */
      return DGDTOOLS.check._isMobileOrPad();
    },
  },
  mounted: function () {
    this.getMyBack();
  }
})