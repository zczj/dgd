var registerModel = new Vue({
  el: '#register',
  data: {
    verify: false, //  form验证
    checboxSelected: false, // checkbox是否选中
    pulldownShow: false,
    iframeUrl: 3
  },
  methods: {
    register: function() {
      var _this = this,
        telPhoneNum = _this.$refs.telPhoneNum,
        imageVerify = _this.$refs.imageVerify,
        SMSVerify = _this.$refs.SMSVerify,
        password = _this.$refs.password,
        confirmPassword = _this.$refs.confirmPassword,
        recommend = _this.$refs.recommend;

      // 调用form验证方法验证输入

      console.log(this.formVerify());




      return false;
      if (this.verify) {
        // loading
        headerModel.loading = true;
        $.ajax({
          url: headerModel.api + '/Reg/PostUserInfo',
          type: 'POST',
          data: {
            "token": "1",
            "UserID": 0,
            "Phone": telPhoneNum.value,
            "FullName": "",
            "Password": password.value,
            "ConfirmPassword": confirmPassword.value,
            "Email": "",
            "ImgCode": imageVerify.value,
            "code": SMSVerify.value,
            "Account": "",
            "PromotionCode": "",
            "RegSource": 0,
            "WechatID": "",
            "TradePassword": "",
            "UserType": ""
          },
          success: function(res) {
            if (res.resultid !== 200) {
              passportModel.getVerify(_this)
              headerModel.loading = false
              passportModel.errorFn(res.message)
              telPhoneNum.focus()
              telPhoneNum.select()
            } else {
              DGDTOOLS.store.save('userInfo', res)
              window.location.href = './Success?register'
            }
          }
        })
      }
    },
    // 表单验证
    formVerify: function() {
      var telPhoneNum = this.$refs.telPhoneNum, // 手机号码
        imageVerify = this.$refs.imageVerify, // 图形验证码
        SMSVerify = this.$refs.SMSVerify, // 短信验证码
        password = this.$refs.password, // 密码
        confirmPassword = this.$refs.confirmPassword; // 确认密码

      if (!this.telVerify()) {
        return false
      }
      if (!this.imageVerify()) {
        return false
      }
      if (!this.SMSVerify()) {
        return false
      }
      if (!this.passwordVerify()) {
        return false
      }
    },
    // 手机号码验证
    telVerify: function() {
      var telPhoneNum = this.$refs.telPhoneNum;
      if (telPhoneNum.value === '' || !passportModel.verifyTel(telPhoneNum.value)) {
        // 电话号码验证
        this.errorContrl(telPhoneNum, '手机号码格式不正确');
        return false;
      }
      $(telPhoneNum).removeClass('success error').addClass('success');
      return true;
    },
    // 图形验证码验证
    imageVerify: function() {
      var imageVerify = this.$refs.imageVerify;
      if (imageVerify.value === '' || !passportModel.verifyImage(imageVerify.value)) {
        // 图形验证码验证
        this.errorContrl(imageVerify, '图形验证码格式不正确');
        return false;
      }
      $(imageVerify).removeClass('success error').addClass('success');
      return true;
    },
    // 短信验证码验证
    SMSVerify: function() {
      var SMSVerify = this.$refs.SMSVerify;
      if (SMSVerify.value === '' || !passportModel.verifyImage(SMSVerify.value)) {
        // 短信验证码验证
        this.errorContrl(SMSVerify, '短信验证码格式不正确');
        return false;
      }
      $(SMSVerify).removeClass('success error').addClass('success');
      return true;
    },
    // 密码验证
    passwordVerify: function() {
      var password = this.$refs.password;
      if (password.value === '' || !passportModel.verifyImage(password.value)) {
        // 密码验证
        this.errorContrl(password, '密码格式不正确');
        return false;
      }
      $(password).removeClass('success error').addClass('success');
      return true;
    },
    // 错误提示操作
    errorContrl: function(ele, msg) {
      passportModel.errorFn(msg);
      $(ele).removeClass('success error').addClass('error');
      this.verify = false;
      ele.focus();
      ele.select();
    },
    //发送短信
    sendSMS: function() {
      var _this = this,
        telPhoneNum = this.$refs.telPhoneNum,
        imageVerify = this.$refs.imageVerify,
        SMSVerify = this.$refs.SMSVerify;

      if (!this.telVerify()) {
        return false
      }
      if (!this.imageVerify()) {
        return false
      }


      $.ajax({
        type: "POST",
        url: "/Passport/SendPhoneCode",
        data: {
          phone: telPhoneNum.value,
          c: imageVerify.value
        },
        success: function(res) {
          // console.log(res)
          switch (res) {
            case '该手机号码被使用':
              _this.errorContrl(telPhoneNum, '该手机号码已被使用')
              break;
            case '图形验证码错误':
              _this.errorContrl(imageVerify, '图形验证码错误')
              break;
            case '发送过于频繁':
              passportModel.errorFn('发送过于频繁');
              SMSVerify.focus();
              break;
            case '发送成功':
              $(telPhoneNum).removeClass('success error').addClass('success');
              $(imageVerify).removeClass('success error').addClass('success');
              SMSVerify.focus();

              // passportModel.getSMSVerify(telPhoneNum.value)
              break;
            default:
              break;
          }
        }
      });
    },
    //显示
    pulldown: function(num) {
      var _this = this;
      this.pulldownShow = true;
      this.iframeUrl = num;

      setTimeout(function() {
        _this.setIframe();
      }, 400)
      _this.DGDscroll();
    },
    // 关闭
    closePulldown: function() {
      this.pulldownShow = false;

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
      DGDTOOLS.Ev._mousewheel(this.$refs.DGDscroll, 'mousewheel', function(event) {
        var top = -$('#iframe').height() + registerModel.$refs.DGDscroll.clientHeight;
        var iScale = 0;

        if (event.delta > 0) {
          // console.log('up');
          i = (i + iSpeed) >= 0 ? 0 : (i + iSpeed);
        } else {
          // console.log('down');
          i = (i - iSpeed) <= top ? top : (i - iSpeed);
        }
        $('.scroll-bar').css('width', i / top * 100 + '%')
        $('#iframe').css('transform', 'translateY(' + i + 'px)');
      })
    }
  },
  mounted: function() {
    $('#loader').fadeOut("300")
    this.$refs.telPhoneNum.focus()
  }
})