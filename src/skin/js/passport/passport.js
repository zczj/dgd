Vue.config.devtools = true
var passportModel = new Vue({
  el: '.passport-common',
  data: {
    sms: '发送',
    sended: false,  // 是否已发送短信验证码
    error: false,  // 表单验证错误提示
    errorMsg: '',  // 表单验证错误提示信息
    delay: 5000,  // 提示消失时间（ms）
    verify: false  // 验证成功与否
  },
  methods: {
    // 验证手机号码
    verifyTel: function (str) {
      var re = /^1(3|4|5|7|8)\d{9}$/
      return re.test(str)
    },
    // 验证邮箱
    verifyEmail: function (str) {
      var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      return re.test(str)
    },
    // 验证图形验证码
    verifyImage: function (str) {
      var re = /^[a-zA-Z0-9]{4}$/
      return re.test(str)
    },
    // 验证短信验证码
    verifySMS: function (str) {
      var re = /^\d{4}$/
      return re.test(str)
    },
    // 密码长度验证
    passwordLength: function (str) {
      var re = /^.{6,20}$/
      return re.test(str)
    },
    // 提示消失
    cancelNotice: function () {
      var _this = this
      setTimeout(function () {
        _this.error = false
      }, _this.delay)
    },
    // 错误提示
    errorFn: function (msg) {
      this.errorMsg = msg
      this.error = true
      this.cancelNotice()
    },
    // 刷新图形验证码
    getVerify: function (obj) {
      var verifyImage = obj.$refs.verifyImage
      verifyImage.src = 'http://www.dgd.vc/Passport/VerifyImage?r='+Math.random()
    },
    // 倒计时
    countdown: function () {
      var num = 20, timer = null, _this = this
      this.sms = '重新发送(<em style="color:red;font-style:normal;">'+num+'</em>)s'
      this.sended = true
      timer = setInterval(function () {
        num--
        if( num <=0 ){
          clearInterval(timer)
          _this.sended = false
          _this.sms = '重新发送'
          return
        }
        _this.sms = '重新发送(<em style="color:red;font-style:normal;">'+num+'</em>)s'
      }, 1000)
    },
    // 获取短信验证码
    getSMSVerify: function (tel) {
      var getSMSUrl = 'http://devapi.zczj.com:80/api/Passport/SendPhoneCode?phone='+tel+'&t=getpwd'
      this.$http.get(getSMSUrl).then(function(res){
        if (res.data.resultid == 200) {
          // 设置按钮文字状态
          this.countdown()
          // 弹窗提示
          $.dialog({
            type: 'ok',
            message: '发送成功！',
            delay: 2000,
            effect: true
          })
        } else {
          this.errorFn(res.message)
        }
      })
    },
    // 发送短信
    sendSMS: function (obj) {
      var tel = obj.$refs.telPhoneNum,
          imageVerify = obj.$refs.imageVerify

      // 手机号码验证
      if (tel.value === '' || !this.verifyTel(tel.value)) {
        this.errorFn('请填写正确的手机号码')
        tel.focus()
        tel.select()
        return
      }
      // 图形验证码验证
      if (imageVerify.value == '' || !this.verifyImage(imageVerify.value)) {
        this.errorFn('请填写正确的图形验证码')
        imageVerify.focus()
        imageVerify.select()
        return
      }
      // 发送短信方法
      if (!this.sended){
        this.getSMSVerify(tel.value)
      }
    },

  }
})



