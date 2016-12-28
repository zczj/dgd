var registerModel =  new Vue({
  el: '#register',
  data: {
    // formShow: true,
  },
  methods: {
    register: function () {
      var _this = this,
          telPhoneNum = _this.$refs.telPhoneNum,
          imageVerify = _this.$refs.imageVerify,
          SMSVerify = _this.$refs.SMSVerify,
          password = _this.$refs.password

      if (telPhoneNum.value == '' || !passortModel.verifyTel(telPhoneNum.value)) {
        passortModel.errorFn('请填写正确的手机号码')
        telPhoneNum.focus()
        telPhoneNum.select()
        return
      }
    }
  },
  mounted: function () {
    this.$refs.telPhoneNum.focus()
   /* this.$nextTick(function () {
      loaderModel.showLoader = false
    })*/
  }
})


window.onload = function () {
  loaderModel.showLoader = false
}