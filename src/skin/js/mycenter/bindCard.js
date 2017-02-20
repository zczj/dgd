/**
 * 绑定银行卡
 * 工行： 621661280000447287
 */

var bindCardModel = new Vue({
  el: '#model-bindCard',
  data: {
    orderId: '',
    orderInfo: '',
    bankSelected: '0', // 银行
    authen: '', // 用户信息
    provinceS: '0', // 选中的省份
    cityS: '', // 选中的城市
    province: '',
    city: '',
    backCode: '', // 银行卡号
    masterBank: '', // 支行名称
    tel: '', // 预留手机号
    showProvince: false,
    showCity: false,
    buyLock: false,
    codeText: '获取验证码',
    endTime: 60,
    sendLock: false,
    phoneCode:'', // 手机验证码
    bankLiskt:'', //  银行列表
    // 银行信息
    bankListMap: [{
      'payCode':
      "0", 'bankName': "选择银行"
    },
    {
      'payCode':
      "ICBC", 'bankName': "中国工商银行"
    },
    {
      'payCode':
      "ABC", 'bankName': "中国农业银行"
    },
    {
      'payCode':
      "CCB", 'bankName': "中国建设银行"
    },
    {
      'payCode':
      "BOC", 'bankName': "中国银行"
    },
    {
      'payCode':
      "BCOM", 'bankName': "中国交通银行"
    },
    {
      'payCode':
      "CIB", 'bankName': "兴业银行"
    },
    {
      'payCode':
      "CITIC", 'bankName': "中信银行"
    },
    {
      'payCode':
      "CEB", 'bankName': "中国光大银行"
    },
    {
      'payCode':
      "PAB", 'bankName': "平安银行"
    },
    {
      'payCode':
      "PSBC", 'bankName': "中国邮政储蓄银行"
    },
    {
      'payCode':
      "SHB", 'bankName': "上海银行"
    },
    {
      'payCode':
      "SPDB", 'bankName': "浦发银行"
    },
    {
      'payCode':
      "CMBC", 'bankName': "中国民生银行"
    },
    {
      'payCode':
      "CMB", 'bankName': "招商银行"
    },
    {
      'payCode':
      "GDB", 'bankName': "广发银行"
    },
    {
      'payCode':
      "HXB", 'bankName': "华夏银行"
    }]
  },
  methods: {
    getOrderInfo: function () {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {
        ;
        DGDTOOLS.check._isLogin();
        return;
      } else {
        $('#loader').fadeIn(300);
        this.$http.get(headerModel.api + '/Order/GetOrder?orderid=' + this.orderId).then(function (response) {
          $('#loader').fadeOut(300);
          _this.orderInfo = response.data;
        })
      }
    },
    // 获取认证信息
    getAuthen: function () {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/Pay/QueryAuthenticator?token=' + headerModel.token).then(function (response) {
        $('#loader').fadeOut(300);
        this.authen = response.data
      })
    },
    // 城市二级联动
    getCity: function (id) {
      var _this = this;
      if (id != 0) {
        headerModel.loading = true;
      }
      _this.$http.get(headerModel.api + '/Help/GetCity?provinceid=' + id).then(function (response) {
        headerModel.loading = false;
        _this.showProvince = true;
        if (id != 0) {
          _this.city = response.data.cityList;
          _this.cityS = '0';
        } else {
          _this.province = response.data.cityList;

        }
      })
    },
    getCityStr: function () {
      var _this = this,
        str = '';
      if (_this.provinceS && _this.cityS) {
        for (var i = 0; i < _this.province.length; i++) {
          if (_this.province[i].CityID === _this.provinceS) {
            str += _this.province[i].CityName + ',';
            break;
          }
        }
        for (var i = 0; i < _this.city.length; i++) {
          if (_this.city[i].CityID === _this.cityS) {
            str += _this.city[i].CityName;
            break;
          }
        }
      }
      return str;
    },
    bindCh: function () {
      var _this = this;
      if (_this.bankSelected == '0') {
        DGDTOOLS.tip._tip('请选择开户银行卡')
        return false;
      }
      if (_this.backCode == '') {
        DGDTOOLS.tip._tip('请输入银行卡号', function () {
          _this.$refs.backCode.focus();
        })
        return false;
      }
      if (isNaN(_this.backCode) || _this.backCode.length < 16) {
        DGDTOOLS.tip._tip('银行卡号输入不合法', function () {
          _this.$refs.backCode.focus();
        })
        return false;
      }
      if (!_this.provinceS || !_this.cityS) {
        DGDTOOLS.tip._tip('请选择银行卡开户省市')
        return false;
      }
      if (_this.masterBank == '') {
        DGDTOOLS.tip._tip('请输入支行名称', function () {
          _this.$refs.masterBank.focus();
        })
        return false;
      }
      return true;
    },
    // 定单页绑上提交页面
    bindFn: function () {
      var _this = this;
      if (!_this.bindCh()) {
        return;
      }
      if (_this.tel == '') {
        DGDTOOLS.tip._tip('请输入银行卡预留手机号', function () {
          _this.$refs.tel.focus();
        })
        return;
      }
      if (!DGDTOOLS.check._isPhone(_this.tel)) {
        DGDTOOLS.tip._tip('预留手机号不合法！', function () {
          _this.$refs.tel.focus();
        })
        return;
      }

      $.dialog({
        type: 'warning',
        message: '使用该卡进行支付后会自动绑定该卡作为以后充值、支付、提现的唯一卡',
        buttons: [{
          text: '确认',
          type: 'green',
          callback: function () {
            // 前端验证通过 可以提交了。。。
            if (_this.buyLock) {
              return;
            } else {
              _this.buyLock = true;
            }

            // 提交

            $.ajax({
              url: headerModel.api + '/Pay/Deal',
              data: {
                "PayCode": _this.bankListMap[_this.bankSelected].payCode, // 银行的编号
                "AccNo": _this.backCode, // 银行卡号
                "IdHolder": _this.authen.FullName, // 持卡人（真实姓名）
                "IdCard": _this.authen.IDNumber,// 身份证
                "Mobile": _this.tel,// 手机号码
                "TxnAmt": _this.orderInfo.order.PayAmount.toFixed(2),// 交易金额
                "TradeNo": _this.orderId,// 订单号
                "Token": headerModel.token,
                "City": _this.provinceS + ',' + _this.cityS, // 省份和城市信息的组合
                "BankName": _this.bankListMap[_this.bankSelected].bankName,// 银行名称
                "BranchName": _this.masterBank  // 支行名称         
              },
              type: 'post',
              success: function (response) {
                if (response.retCode == '0000') {
                  _this.buyLock = false;
                  // 提交成功跳转到订单确认页面，根据定单id
                  DGDTOOLS.tip._tip('银行卡绑定成功', function () {
                    window.location.href="orderConf.html?orderId="+ response.orderid;
                  })

                } else {
                  _this.buyLock = false;
                  DGDTOOLS.tip._tip(response.retMsg)
                }
              },
              error: function (e) {
                _this.buyLock = false;
                DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
                console.error(e.status + ":" + e.responseText);
              }
            })


          }
        }, {
          text: '取消',
          type: 'red'
        }],
        maskClose: true,
        effect: true
      })





    },
    // 非订单页面绑卡提交方法
    addBankCard: function () {
      var _this = this;
      console.log(_this.phoneCode)
      if (!_this.bindCh()) {
        return;
      }
      if(_this.phoneCode==''){
        DGDTOOLS.tip._tip('请输入手机验证码')
        return;
      }
      if (_this.buyLock) {
        return;
      } else {
        _this.buyLock = true;
      }

      $.ajax({
        url: headerModel.api + '/MyCenter/AddBankCark',
        data: {
          "token": headerModel.token,
          "provinceid": _this.provinceS, // 省ID
          "cityid": _this.cityS, // 城市ID
          "bankid": _this.bankSelected, // 银行ID
          "branchname": _this.masterBank, // 支行名称
          "cardid": _this.backCode, // 卡号
          "phonecode": _this.phoneCode, // 短信验证码
          "Phone": mySideModel.userBaseInfo.Phone // 手机号码
        },
        type: 'post',
        success: function (response) {
          if (response.resultid == 200) {
            _this.buyLock = false;
            // 提交成功跳转到订单确认页面，根据定单id
            DGDTOOLS.tip._tip('银行卡绑定成功', function () {

              // window.location.href="orderConf.html?orderId="+ response.orderid;
            })

          } else {
            DGDTOOLS.tip._tip(response.message, function () {
              _this.buyLock = false;
            })
          }
        },
        error: function (e) {
          _this.buyLock = false;
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    // 获取验证码：
    getCode: function () {
      var _this = this;
      if (_this.sendLock) {
        return
      }
      _this.sendLock = true;
      // 1.1 计时
      _this.codeText = 60 + '秒';
      _this.time = setInterval(function () {
        if (_this.endTime === 0) {
          _this.endTime = 60;
          _this.codeText = '获取验证码';
          _this.sendLock = false;
          clearInterval(_this.time);
        } else {
          _this.endTime--;
          _this.codeText = _this.endTime + '秒'

        }
      }, 1000)
      headerModel.loading = true;
        this.$http.get(headerModel.api + '/Passport/SendPhoneCode?phone='+mySideModel.userBaseInfo.Phone+'&t=getpwd').then(function (response) {
          _this.sendLock = false;
          headerModel.loading = false;
        })
    },
    getBankList: function  () {
      this.$http.get(headerModel.api + '/MyCenter/BankList').then(function (response) {
          this.bankListMap = response.data.BankList;
          this.bankListMap.unshift({
            'ID':'0',
            'Name':'请选择银行'
          })
        })
    }
  },
  computed: {
    sheng: function () {
      this.$nextTick(function () {
        return this.province; // => '更新完成'
      })
    },
    /**
     *  true : 个人中心绑卡
     *  false : 定单绑卡
     */
    isMC: function () {
      return this.orderId == 0;
    }
  },
  mounted: function () {
    this.orderId = window.location.search.split('orderId=')[1] || 0;
    // 1.1 定单进绑卡页面
    // 1.2 个人中心进绑卡页面
    // if (!this.orderId) {
    //   window.location.href="../project/index.html"
    // }
    // 103775

    // 个人中心
    if (this.orderId === 0) {
      this.getBankList();
    }
    // 订单页面
    else {
      this.getOrderInfo()

    }
    this.getAuthen()
    this.getCity(0)
    /**
     * 380	38079	苏智慧	430522198504057812	,	中国建设银行	CCB		43052278575758542	2016-10-09 16:19:50.377	NULL	0
721	38079	苏智慧	430522198504057812	130000,130400	招商银行	CMB	dsdsf	6225887836352993	2017-01-09 10:37:13.643	18219523738	1
778	38079	苏智慧	430522198504057812	110000,110104	中国工商银行	ICBC	宣武支行	6223263216005706453	2017-02-17 17:54:14.160	NULL	0
     */
  }
})