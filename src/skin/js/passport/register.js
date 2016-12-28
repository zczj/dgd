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
          recommend = _this.$refs.recommend

      this.formVerify(this)
      if (this.verify) {
        console.log('reg')
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
