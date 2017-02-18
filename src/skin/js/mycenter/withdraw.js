var withdrawModel = new Vue({
  el: '#withdraw',
  data: {
    list: '',
    tmoney: '0',
    bankId: '',
    pwd: '',
    isPop: true
  },
  computed: {
    isWap: function () {
      /**
       * false : pc
       * false : wap
       */
      return DGDTOOLS.check._isMobileOrPad();
    },
    userInfo: function () {
      var res = {};
      // console.log(this.l)
      // res.name = this.l[0].FullName;
      // res.cId = this.l[0].IDNumber;
      return res
    },
    /**
     * 是否在移动端绑定银行卡，用于判断pc端可选银行卡支付
     */
    isDis: function () {
      var res = -1;
      if (this.list.length) {
        for (var i = 0; i < this.list.length; i++) {
          if (this.list[i].iswap) {
            return res = i;
          }
        }
      }
      return res;
    },
    /**
     * 银行ID
     */
    bankNum: function () {
      var res = ''
      // if (this.isDis) {

      // } else {
      //   return res = this.bankId;
      // }
      // if(this.bankId){
      //   res = this.bankId;
      // }else{
      //   res =this.list[this.isDis].MyBankCardID;
      // }

      console.log(this.list.length)

      
      // 1.1 mobile
      // if (!this.isWap) {
      //   res = this.isDis == -1 ? this.bankId : this.list[this.isDis].MyBankCardID
      // }
      // // 1.2 未绑卡
      // else {
      //   res = this.isDis == -1 ? this.bankId : this.list[this.isDis].MyBankCardID
      // }
      res = this.isDis == -1 ? this.bankId : this.list[this.isDis].MyBankCardID
      return res;
    }
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
            if(!_this.list.length&&_this.isWap){
              DGDTOOLS.tip._tip('未绑卡',function(){
                
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
    // 提现
    withDrow: function () {
      var _this = this;
      if (_this.checkInput()) {
        return;
      }

      headerModel.loading = true;
      $.ajax({
        url: headerModel.api + '/MyCenter/Withdraw',
        data: {
          "password": $.md5($.md5(_this.pwd)),
          "tMoney": _this.tmoney,
          "MyBankCardID": _this.bankNum,
          "Token": headerModel.token,

        },
        type: 'post',
        success: function (response) {

          headerModel.loading = false
          if (response.resultid === 200) {
            DGDTOOLS.tip._tipAll({
              msg: '恭喜你！提现申请成功！',
              type: 'ok',
              callback: function () {
                mySideModel.userBaseInfo.AvailableBalance -= _this.tmoney;
              }
            });

          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          headerModel.loading = false
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    }
  },
  created: function () {
    this.getMyBack();
  }
})