var orderModel = new Vue({
  el: '#model-order',
  data: {
    proId: '',
    buyInfo: '',
    part: 1, // 认投份数
    selected: '0', // 选择的coupon
    amount: 0, // 认投金额
    OrderType: '1', // 认购方式 1.认购并在线支付 0.认购不付款
    readyRule: true,
    formLock: false,
    gdCh: false, // 股东券
    pulldownShow: false, // 用户协议
    iframeUrl: 2 // iframe内容
  },
  methods: {
    getBuyInfo: function() {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {;
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
          success: function(response) {
            $("#loader").fadeOut(300);
            if (response.resultid == 200) {
              _this.buyInfo = response;
              _this.amount = response.project.OriginalLowVote;
            } else {
              console.log(response.message);
            }
          },
          error: function(e) {
            console.error(e.status + ":" + e.responseText);
          }
        })
      }
    },
    // 禁用非数字型
    numEv: function(e) {
      return DGDTOOLS.check._isNumPoint(e)
    },
    // 检测转入是否规范
    numCh: function() {
      var _this = this;
      if (this.amount == '' || this.amount < this.buyInfo.project.OriginalLowVote - 0) {
        this.amount = this.buyInfo.project.OriginalLowVote;
        DGDTOOLS.tip._tip('金额必须大于最低跟投小于最高跟投', function() {
          _this.$refs.amount.focus()
        })
      }
    },
    // 检测认投份数输入规范
    partCh: function() {
      var _this = this;
      if (_this.part == '' || _this.part <= 0) {
        _this.part = 1;
        DGDTOOLS.tip._tip('最低1份起投', function() {
          _this.$refs.part.focus()
        })
      }
    },
    initCoupon: function() {
      this.selected = '0';
      return;
    },
    // 检测coupon 是否可用
    couponCh: function() {
      var _this = this;
      // 此项目不能使用抵扣劵
      if (_this.buyInfo.project.ProjectID == "1217") {
        DGDTOOLS.tip._tip('此项目不能使用抵扣劵', this.initCoupon)
      }

      // 定期项目不能使用优惠劵
      if (_this.buyInfo.project.StandType == 1) {
        DGDTOOLS.tip._tip('定期项目不能使用优惠劵', this.initCoupon)
      }

      // 判断投之家分配 (缺接口)
      // 当前项目已经使用过抵扣劵,同一项目不能重复使用 (缺接口)

      // 使用了股东劵不能再使用优惠券
      if (_this.gdCh) {
        DGDTOOLS.tip._tip('使用了股东劵不能再使用优惠券', this.initCoupon)
      }


      if (_this.coupon.Remark != "抵用券活动") {
        var amount = _this.amount * _this.part,
          camount = _this.coupon.Amount;
        // 投资金额区间判断
        if (amount < 10000) {
          DGDTOOLS.tip._tip('认投金额小于1万不能使用', this.initCoupon)
        }

        if (amount >= 10000 && amount < 20000) {
          if (parseInt(camount) > 50) {
            DGDTOOLS.tip._tip('投资满1万只可抵扣50元', this.initCoupon)
          }
        } else if (amount >= 20000 && amount < 30000) {
          if (parseInt(camount) > 100) {
            DGDTOOLS.tip._tip('投资满2万只可抵扣100元', this.initCoupon)
          }
        } else if (amount >= 30000 && amount < 40000) {
          if (parseInt(camount) > 150) {
            DGDTOOLS.tip._tip('投资满3万只可抵扣150元', this.initCoupon)
          }
        } else if (amount >= 40000 && amount < 50000) {
          if (parseInt(camount) > 200) {
            DGDTOOLS.tip._tip('投资满4万只可抵扣200', this.initCoupon)
          }
        }
      } else {
        if (amount < 20000) {
          DGDTOOLS.tip._tip('认投金额小于2万不能使用', this.initCoupon)
        }
      }
    },
    // 检测 股东券是否可用
    gdAccountCh: function() {
      var _this = this
      if (_this.selected != '0') {
        DGDTOOLS.tip._tip('使用了优惠券不能再使用股东劵', function() {
          _this.gdCh = false;
        })
      }
    },
    partAdd: function() {
      this.part++;
    },
    partCut: function() {
      if (this.part == 1) {
        return;
      }
      this.part--
    },
    // 提交
    nextFn: function() {

      var _this = this;

      if (!_this.readyRule) {
        DGDTOOLS.tip._tip('请阅读并同意')
        return;
      }
      headerModel.loading = true;


      // 加锁，防多次点击
      if (_this.formLock) {
        return;
      } else {
        _this.formLock = true;
      }

      // 先核对算出的结果，一致后才提交
      $.ajax({
        url: headerModel.api + '/Buy/OrderCount',
        data: {
          "Token": headerModel.token,
          "PayMethod": _this.orderRule ? _this.orderRule.Type : '',
          "Num": _this.part,
          "ProjectID": _this.buyInfo.project.ProjectID,
          "Amount": _this.amount * 1,
          "Coupon": _this.selected == '0' ? '' : _this.selected,
          "IsGDRebate": _this.gdCh
        },
        type: 'post',
        success: function(response) {

          if (response.resultid == 200) {
            // _this.buyInfo = response;
            // 校验前台与后台扣费是否一致
            if (response.PayAmount * 1 === _this.totleResult * 1) {
              _this.formLock = false;
              headerModel.loading = false;

              $.ajax({
                url: headerModel.api + '/Buy/PostBuy',
                data: {
                  "ProjectID": _this.buyInfo.project.ProjectID,
                  "Amount": _this.amount,
                  "OrderType": orderModel.OrderType * 1,
                  "ctype": 0,
                  "pfullname": "",
                  "pphone": "",
                  "paddress": "",
                  "AmountNum": _this.part,
                  "ckCoupon": _this.selected == '0' ? '' : _this.selected,
                  "token": headerModel.token,
                  "hgadm": _this.gdAccountS == '0' ? '' : _this.selected,
                  "remark": "",
                  "UserID": _this.buyInfo.userinfo.UserID,
                  "FullName": "",
                  "BankAccount": "",
                  "Account": "",
                  "Phone": "",
                  "ReceiveAddress": ""
                },
                type: 'post',
                success: function(response) {
                  if (response.resultid == 200) {
                    // 提交成功跳转到订单确认页面，根据定单id
                    DGDTOOLS.tip._tip(response.message, function() {
                      window.location.href = "orderConf?orderId=" + response.orderid;
                    })

                  } else {
                    DGDTOOLS.tip._tip(response.message)
                  }
                },
                error: function(e) {
                  DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
                  console.error(e.status + ":" + e.responseText);
                }
              })
            } else {
              _this.formLock = false;
              headerModel.loading = false;
              console.log('校验前台与后台扣费是不一致,请联系管理员');
              return;
            }

          } else {
            _this.formLock = false;
            headerModel.loading = false;
            console.log(response.message);

          }
        },
        error: function(e) {
          _this.formLock = false;
          headerModel.loading = false;
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    //显示
    pulldown: function(num) {
      var _this = this;
      this.pulldownShow = true;
      this.iframeUrl = num;
      setTimeout(function() {
        _this.setIframe();
        _this.DGDscroll();
      }, 400)
    },
    // 关闭
    closePulldown: function() {
      this.pulldownShow = false
    },
    // 设置iframe高度
    setIframe: function() {
      var iframeHeight = document.getElementById('iframe').contentWindow.document.getElementsByTagName('html')[0].offsetHeight + 150;
      var iframeHeight2 = document.getElementById('iframe').contentWindow.document.getElementsByTagName('body')[0].offsetHeight + 200;

      $('#iframe').height(Math.max(iframeHeight, iframeHeight2))
    },
    //用户协议滚动事件
    DGDscroll: function() {
      var _this = this,
        i = 0,
        iSpeed = 30;
      DGDTOOLS.Ev._mousewheel(_this.$refs.DGDscroll, 'mousewheel', function(event) {
        var top = -$('#iframe').height() + _this.$refs.DGDscroll.clientHeight;
        var iScale = 0;

        if (event.delta > 0) {
          console.log('up');
          i = (i + iSpeed) >= 0 ? 0 : (i + iSpeed);
        } else {
          console.log('down');
          i = (i - iSpeed) <= top ? top : (i - iSpeed);
        }
        $('.scroll-bar').css('width', i / top * 100 + '%')
        $('#iframe').css('transform', 'translateY(' + i + 'px)');
      })
    }


  },
  computed: {
    /**
     * 是否有订单规则
     * @Author: 老苏
     * @return  {boolen} 布尔值
     */
    orderRule: function() {
      return this.buyInfo.ProjectRule;
    },
    /**
     * 计算总金额
     * @Author: 老苏
     * @return  {[type]} [description]
     */
    totleResult: function() {
      if (!this.coupon.Amount) {
        this.coupon.Amount = 0;
      }
      var res = parseInt(this.amount) * this.part * 1 + (this.manageFree * 1) - this.coupon.Amount - this.gdAccountS;
      return res.toFixed(2);
    },
    // ManagerFee 管理费
    manageFree: function() {
      var res = 0;
      this.amount = isNaN(this.amount) ? this.buyInfo.project.OriginalLowVote : this.amount;
      if (this.orderRule) {
        return (this.buyInfo.ProjectRule.ManagerFee * this.part * this.amount).toFixed(2);
      }
      return res;
    },
    // 股东券
    gdAccount: function() {
      var res = null;
      if (this.buyInfo.gdAccount) {
        var lowVote = this.buyInfo.project.OriginalLowVote * this.part * 0.01,
          availableBalance = this.buyInfo.gdAccount.AvailableBalance;

        return res = availableBalance < lowVote ? availableBalance : lowVote;
      }
      return res;
    },
    // 选择股东券 面值
    gdAccountS: function() {
      var res = 0;
      if (this.gdAccount && this.gdCh) {
        res = this.gdAccount.toFixed(2);
      }
      return res;
    },
    // 返回用户选择的 coupon
    coupon: function() {
      var res = {};
      if(this.buyInfo.CouponList){
        for (var i = 0; i < this.buyInfo.CouponList.length; i++) {
          if (this.buyInfo.CouponList[i].CouponID == this.selected) {
            return res = this.buyInfo.CouponList[i];
          }
        }
      }
      return res
    }
  },
  mounted: function() {
    // 获取url传参过来的资讯id
    this.proId = window.location.search.split('id=')[1] || 0;
    if (this.proId == 0) {
      window.location.href = "../project/index.html"
    }
    if (this.buyInfo.project) {
      console.log('预约项目');
    } else {
      console.log('普通项目');
    }
    // this.proId = '1037' // 有规则(按份数)
    // this.proId = '1034' // 有规则(按金额)
    // this.proId = '1022' // 有规则(按金额 (0.01))
    // this.proId = '1278' // 有规则(按金额 (120))
    // this.proId = '1272' // 无规则
    this.getBuyInfo();
  }
})