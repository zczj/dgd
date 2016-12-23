var loginModel = new Vue({
      el: '#login',
      data: {
        formShow: false, // 显示隐藏手机登录还是账号登录
        sms: '发送',
        sended: false,  // 是否已发送短信验证码
        error: false,  // 表单验证错误提示
        errorMsg: '',  // 表单验证错误提示信息
      },
      methods: {
        sendSMS: function () {
          if (this.sended){
            // 已发送短信，倒计时内不可再点击
            return false
          } else {
            // 设置按钮文字状态
            this.countdown()

            // 发送短信方法
            console.log(1)
          }
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
        // 重新获取验证码
        refreshVerify: function () {
          console.log('重新获取验证码')
        },
        login: function () {
         headerModel.fromUrl = window.location.search.split('url=')[1]
          var _this = this, _delay = 5000,
              account = $('.account input.account').val(),
              // 密码加密
              password =  $.md5($.md5($('.account input.password').val()))

          if (account == '' || password == '') {
            _this.errorMsg = '账号或密码不能为空'
            _this.error = true
            setTimeout(function () {
              _this.error = false
            }, _delay)
          } else {
            $("#loader").fadeIn(300)
            $.ajax({
              url: 'http://devapi.zczj.com:80/api/Passport/Login',
              data: {
                'Account': account,
                'Password': password
              },
              type: 'post',
              success: function (response) {
                if(response){
                  $("#loader").fadeOut(300)

                  if(response.resultid !== 200){
                    // 请求成功，账号或密码不正确
                    _this.error = true
                    _this.errorMsg = response.message
                    setTimeout(function () {
                      _this.error = false
                    }, _delay)
                  } else if (response.resultid === 200) {
                    // 请求成功，账号密码正确，登录成功
                    $("#loader").fadeOut(300)
                    // 登录成功，跳转
                    // doSomething
                    //用户信息
                    //{"token":"","uid":,"Avatar":"","UserName":"","message":"","resultid":}
                    DGDTOOLS.store.save('userInfo', response);
                    window.location.href = './success.html?login&url='+window.location.search.split('url=')[1]
                  }
                }
              },
              error: function(e){
                $("#loader").fadeOut(300);
                $.dialog({
                  type: 'ok',
                  message: e.status + ' ' + e.statusText,
                  delay: 1000,
                  effect: true
                })
              }
            })
          }
        }
      }
    })
