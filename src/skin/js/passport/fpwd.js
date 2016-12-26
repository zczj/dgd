var fpwdModel = new Vue({
  el: '#fpwd',
  data: {
    step: 2,
    sended: false,
    sms: '发送',
    error: false,
    errorMsg: ''
  },
  methods: {
    // 第一步
    step1: function () {
      var _this = this,
          step1text = this.$refs.step1text
      if (step1text.value == '') {
        passortModel.errorFn('请输入您的手机号码或邮箱')
        step1text.focus()
        return false
      } else {
        if (passortModel.verifyTel(step1text.value) || !passortModel.verifyEmail(step1text.value)) {
          passortModel.errorFn('请输入正确的手机号码或邮箱')
          step1text.focus()
          step1text.select()
          return false
        }
      }
      this.step = 2
    },
    // 第二步
    step2: function () {

    },

  },
  mounted: function () {
    // this.$refs.step1text.focus()
  }
})