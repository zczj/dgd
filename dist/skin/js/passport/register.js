var registerModel =  new Vue({
  el: '#register',
  data: {
    formShow: true,
    verify: false
  },
  methods: {
    register: function () {
      var _this = this,
          telPhoneNum = _this.$refs.telPhoneNum,
          imageVerify = _this.$refs.imageVerify,
          SMSVerify = _this.$refs.SMSVerify,
          password = _this.$refs.password,
          confirmPassword = _this.$refs.confirmPassword,
          recommend = _this.$refs.recommend
      // 调用form验证方法验证输入
      this.formVerify(this)
      if (this.verify) {
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
          success: function (res) {
            console.log(res)
            if (res.resultid !== 200) {
              passportModel.errorFn(res.message)
            } else {
              alert('zhucechengg')
            }
          }
        })
      }
    },
    // 表单验证
    formVerify: function () {
      var telPhoneNum = this.$refs.telPhoneNum, // 手机号码
          imageVerify = this.$refs.imageVerify, // 图形验证码
          SMSVerify = this.$refs.SMSVerify,  // 短信验证码
          password =  this.$refs.password  // 密码

      if (telPhoneNum.value === '' || !passportModel.verifyTel(telPhoneNum.value)) {
        // 电话号码验证
        passportModel.errorFn('请填写正确的手机号码')
        this.verify = false
        telPhoneNum.focus()
        telPhoneNum.select()
      } else if (imageVerify.value === '' || !passportModel.verifyImage(imageVerify.value)) {
        // 图形验证码验证
        passportModel.errorFn('请填写正确的图形验证码验证')
        this.verify = false
        imageVerify.focus()
        imageVerify.select()
      } else if (SMSVerify.value === '' || !passportModel.verifySMS(SMSVerify.value)) {
        // 短信验证码验证
        passportModel.errorFn('请填写正确的短信验证码')
        this.verify = false
        SMSVerify.focus()
        SMSVerify.select()
      } else if (password.value === '' || !passportModel.passwordLength(password.value)) {
        // 密码验证
        passportModel.errorFn('请填写正确的密码')
        this.verify = false
        password.focus()
        password.select()
      } else {
        this.verify = true
      }
    }
  },
  mounted: function () {
    this.$refs.telPhoneNum.focus()
  }
})
