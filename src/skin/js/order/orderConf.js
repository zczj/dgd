var orderConfModel = new Vue({
  el: '#model-orderConf',
  data: {
    orderInfo: '', // 订单信息
    orderId: 0, // 订单ID
    userBaseInfo: '', // 个人用户信息
    /*
    // 控制显示 && 支付方式
    0:余额支付
    1:在线支付 (默认显示)
    2:线下支付
    3:站岗宝支付
     */
    payMethod: 1,
    payLine: 0, // 在线支付方式
    payLineMap:[{
      'bankcode': '006',
      'bankName': '宝付支付'
    },{
      'bankcode': '005',
      'bankName': '富友支付'
    }] ,
    payPwd:'', //支付密码
    payLock: false
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
        })
      }
    },
    getUserBaseInfo: function (index) {
      var _this = this;
      if (_this.userBaseInfo) {
        _this.payMethod = index;
        return
      }
      headerModel.loading=true;
      $.ajax({
        url: headerModel.api + '/MyCenter/UserBaseInfo',
        data: {
          "token": headerModel.token
        },
        type: 'post',
        success: function (response) {
          _this.payMethod = index;
          headerModel.loading=false;
          if (response.resultid==200) {
            _this.userBaseInfo = response;
          } else {
            console.log(response.message);
          }
        },
        error: function(e) {
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    toggleTab: function (index) {
      if (index==0|| index == 3) {
        this.getUserBaseInfo(index);
      }else{
        this.payMethod = index;
      }
    },
    // 购买
    buyNow: function () {
      var _this = this;
      // 1.1 判断项目状态
      var state = _this.orderInfo.project.State;
      if (state=='1') {
        DGDTOOLS.tip._tip('当前项目还处于预热中');
        return;
      }
      if (state=='3') {
        DGDTOOLS.tip._tip('当前项目融资已完成');
        return;
      }
      // 1.2 判断项目是否上架
      if (_this.orderInfo.project.OnlineState == "0") {
        DGDTOOLS.tip._tip("当前项目未上架或已下架");
        return;
      }

      // 1.3 判断该订单是否已支付
      if (_this.orderInfo.order.PayStatus=='已支付') {
        DGDTOOLS.tip._tip("该订单已支付");
        return;
      }

      if (_this.payPwd == '') {
        DGDTOOLS.tip._tip("请输入支付密码");
      }
      
      if (_this.payLock) {
        return;
      } else {
        _this.payLock = true;
      }
      // 1.4 根据支付方式做对应处理
      headerModel.loading=true;
      if (_this.payMethod == 1) {
        // 1.4.1 在线支付 68539.75

         
          if(headerModel.isMobile){
             // 1.4.1.1 移动端支付
             console.log('移动端支付')
              // 1.4.1.1 查询是否绑卡了
             this.$http.get(headerModel.api + '/Pay/QueryCard?token=' + headerModel.token).then(function (response) {
               
               if(response.data.retCode === '1')
               {
                 // 已绑定卡
                 headerModel.loading=false;
                _this.payLock = false;

               }else{                 
                 // 未绑定卡
                 headerModel.loading=false;
                _this.payLock = false;
                 DGDTOOLS.tip._tip(response.data.retMsg,function () {
                   window.location.href='../MyCenter/bindCard.html?orderId='+ _this.orderId;
                 });
               }
             })
          }else{

            // 1.4.1.2 Pc 支付
            $.ajax({
              url: headerModel.api + '/Pay/PayForPC',
              data: {
                "Token": headerModel.token,
                "Amount": _this.orderInfo.order.PayAmount,
                "AssociatedBank": _this.payLineMap[_this.payLine].bankName,
                "bankcode": _this.payLineMap[_this.payLine].bankcode,
                "orderid": _this.orderId,
                "payPassword": $.md5($.md5(_this.payPwd))
              },
              type: 'post',
              success: function  (response) {
                headerModel.loading=false;
                _this.payLock = false;
                if(response.resultid == 200){
                  document.body.innerHTML = response.HTML;
                  if(_this.payLine == 0){
                    document.getElementById('pay').submit();
                  }else{
                    document.getElementById('form1').submit();
                  }
                }else{
                  DGDTOOLS.tip._tip(response.message);
                }
              },
              error: function  (e) {
                headerModel.loading=false;
                _this.payLock = false;
                console.error(e.status + ":" + e.responseText);
              }
            })
          }
          
          
      }else{
        // 1.4.2 余额 && 站岗宝支付
          
          $.ajax({
            url: headerModel.api + '/Order/PostOrder',
            data: {
              "token": headerModel.token,
              "orderid": _this.orderId,
              "PayPassworld": $.md5($.md5(_this.payPwd)),
              "paytype": _this.payMethod,
              "PayPlat": 0
            },
            type: 'post',
            success: function (response) {
              headerModel.loading=false;
              _this.payLock=false;
              if (response.resultid==200) {
                window.location.href='complete.html?orderId='+ _this.orderId;
              } else {
                DGDTOOLS.tip._tip(response.message);
              }
            },
            error: function(e) {
              headerModel.loading=false;
              _this.payLock=false;
              console.error(e.status + ":" + e.responseText);
            }
          })
      }


    }
  },
  computed: {

  },
  mounted: function () {
    this.orderId = window.location.search.split('orderId=')[1] || 0;
    if (!this.orderId) {
      window.location.href="../project/index.html"
    }
    // 103752
    this.getOrderInfo();
  }
})