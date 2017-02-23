var loginModel = new Vue({
  el: '#login',
  name: 'login',
  data: {
    formShow: false, // 显示隐藏手机登录还是账号登录
    checkName: false, // 记住密码
  },
  methods: {
    // 账号登录
    login: function() {
      var _this = this,
        account = this.$refs.account,
        // 密码加密
        password = this.$refs.password;
      $(account).removeClass('success error');
      $(password).removeClass('success error');
      console.log(this.checkName)

      if (account.value === '') {
        passportModel.errorFn('账号不能为空')
        $(account).removeClass('success error').addClass('error')
        account.focus()
        account.select()
        return false
      } else {
        $(account).removeClass('success error').addClass('success')
      }

      if (password.value === '' || !passportModel.passwordLength(password.value)) {
        passportModel.errorFn('请填写正确的密码')
        $(password).removeClass('success error').addClass('error')
        password.focus()
        password.select()
        return false
      }

      headerModel.loading = true;

      $.ajax({
        url: headerModel.api + '/Passport/Login',
        data: { 'Account': account.value, 'Password': $.md5($.md5(password.value)) },
        type: 'post',
        success: function(response) {
          if (response) {
            $("#loader").fadeOut(300)
            if (response.resultid !== 200) {
              // 请求成功，账号或密码不正确
              headerModel.loading = false
              passportModel.errorFn(response.message)
              $(account).removeClass('success error').addClass('error')
              $(password).removeClass('success error').addClass('error')
              account.focus()
              account.select()
            } else if (response.resultid === 200) {
              // 请求成功，账号密码正确，登录成功
              //用户信息
              //{"token":"","uid":,"Avatar":"","UserName":"","message":"","resultid":}
              DGDTOOLS.store.save('userInfo', response);
              _this.successFn()
              headerModel.loading = false
            }
          }
        },
        error: function(e) {
          $.dialog({
            type: 'ok',
            message: e.status + ' ' + e.statusText,
            delay: 1000,
            effect: true
          })
        }
      })
    },
    // 短信验证码登录
    loginBySMS: function() {
      var verifySMSUrl = headerModel.api + '/Passport/ValidatePhoneCode',
        telPhoneNum = this.$refs.telPhoneNum,
        imageVerify = this.$refs.imageVerify,
        // verifyImage = this.$refs.verifyImage,
        SMSVerify = this.$refs.SMSVerify,
        _this = this;
      if (telPhoneNum.value === '' || !passportModel.verifyTel(telPhoneNum.value)) {
        // 电话号码验证
        passportModel.errorFn('请填写正确的手机号码')
        telPhoneNum.focus()
        telPhoneNum.select()
        $(telPhoneNum).removeClass('success error').addClass('error')
        return false
      } else {
        $(telPhoneNum).removeClass('success error').addClass('success')
      }
      if (imageVerify.value === '' || !passportModel.verifyImage(imageVerify.value)) {
        // 图形验证码验证
        passportModel.errorFn('图形验证码格式不正确')
        imageVerify.focus()
        imageVerify.select()
        $(imageVerify).removeClass('success error').addClass('error')
        return false
      } else {
        $(imageVerify).removeClass('success error').addClass('success')
      }
      if (SMSVerify.value === '' || !passportModel.verifySMS(SMSVerify.value)) {
        // 短信验证码验证
        passportModel.errorFn('短信验证码格式不正确')
        SMSVerify.focus()
        SMSVerify.select()
        $(SMSVerify).removeClass('success error').addClass('error')
        return false
      } else {
        $(SMSVerify).removeClass('success error').addClass('success')
      }

      // 验证图形验证码
      passportModel.getImageVerify(this, true)
        // console.log(passportModel.isImageVerify);
      if (!passportModel.isImageVerify) {
        // console.log('图形验证码验证失败');
        return false;
      }
      // console.log('图形验证码验证成功');


      // 登录验证
      $.ajax({
        url: verifySMSUrl,
        type: 'POST',
        data: { "Phone": telPhoneNum.value, "Code": SMSVerify.value },
        success: function(res) {
          // 请求成功，但验证失败
          if (res.resultid !== 200) {
            passportModel.errorFn(res.message)
            SMSVerify.select();
            $(SMSVerify).removeClass('success error').addClass('error')
            return false
          } else {
            _this.successFn()
          }
        },
        error: function(e) {
          $.dialog({
            type: 'ok',
            message: e.status + ' ' + e.statusText,
            delay: 1000,
            effect: true
          })
        }
      })
    },
    // 登录成功后跳转
    successFn: function() {
      window.location.href = (window.location.search.split('url=')[1] || '')
    },
    toggle: function() {
      this.formShow = !this.formShow
    }
  },
  mounted: function() {
    $('#loader').fadeOut("300")
    this.$refs.account.focus()
  }
})