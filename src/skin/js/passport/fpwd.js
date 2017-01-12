var fpwdModel = new Vue({
  el: '#fpwd',
  data: {
    step: 1,
    tel: ''
  },
  methods: {
    // 第一步
    step1: function() {
      var _this = this,
        telPhoneNum = this.$refs.telPhoneNum
      if (telPhoneNum.value == '') {
        passportModel.errorFn('请输入您的手机号码或邮箱')
        telPhoneNum.focus()
        return false
      } else {
        if (passportModel.verifyTel(telPhoneNum.value) || passportModel.verifyEmail(telPhoneNum.value)) {
          this.step = 2
          this.tel = telPhoneNum.value
        } else {
          passportModel.errorFn('请输入正确的手机号码或邮箱')
          telPhoneNum.focus()
          telPhoneNum.select()
          return false
        }
      }
    },
    // 第二步
    step2: function() {
      var _this = this,
        SMSVerify = this.$refs.SMSVerify,
        newPassword = this.$refs.newPassword,
        verifySMSUrl = headerModel.api + '/Passport/ValidatePhoneCode'

      if (SMSVerify.value == '') {
        passportModel.errorFn('请输入短信验证码')
        SMSVerify.focus()
        return false
      }
      if (newPassword.value == '') {
        passportModel.errorFn('请输入您的新密码')
        newPassword.focus()
        return false
      }
      // loading
      headerModel.loading = true;
      $.ajax({
        url: verifySMSUrl,
        type: 'POST',
        data: { "Phone": _this.tel, "Code": SMSVerify.value },
        success: function(res) {
          if (!res) {
            return false
          }
          headerModel.loading = false
            // 请求成功，但验证失败
          if (res.resultid !== 200) {
            passportModel.errorFn(res.message)
            SMSVerify.select()
          } else {
            _this.step = 3
            console.log(_this.step)
              // window.location.href = './success.html?fpwd'
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

  },
  mounted: function() {
    $('#loader').fadeOut("300")
    this.$refs.telPhoneNum.focus()
  }
})