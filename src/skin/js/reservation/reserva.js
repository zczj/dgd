/**
 * 预约项目
 */

var reservaModel = new Vue({
  el: '#model-reserva',
  data: {
    proId: '',
    buyInfo: '',
    part: 1, // 认投份数
    amount: 0, // 认投金额
    formLock: false,
    readyRule: true, // 同意条款和协议
    TimesRotation: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'], // 众筹轮次
  },
  methods: {
    getBuyInfo: function () {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {
        ;
        DGDTOOLS.check._isLogin();
        return;
      } else {
        $('#loader').fadeIn(300);
        $.ajax({
          url: headerModel.api + '/Buy/BuyInfo',
          data: {
            "id": _this.proId,
            "token": headerModel.token
          },
          type: 'post',
          success: function (response) {
            $("#loader").fadeOut(300);
            if (response.resultid == 200) {
              _this.buyInfo = response;
              _this.amount = response.project.OriginalLowVote;
            } else {
              console.log(response.message);
            }
          },
          error: function (e) {
            console.error(e.status + ":" + e.responseText);
          }
        })
      }
    },
    partAdd: function () {
      this.part++;
    },
    partCut: function () {
      if (this.part == 1) {
        return;
      }
      this.part--
    },
    // 检测认投份数输入规范
    partCh: function () {
      var _this = this;
      if (_this.part == '' || _this.part <= 0) {
        _this.part = 1;
        DGDTOOLS.tip._tip('最低1份起投', function () {
          _this.$refs.part.focus()
        })
      }
    },
    nextFn: function () {
      var _this = this;
      if (!_this.readyRule) {
        DGDTOOLS.tip._tip('请阅读并同意')
        return;
      }
      headerModel.loading = true;


      // 加锁，防多次点击
      if (_this.formLock) {
        return;
      } else {
        _this.formLock = true;
      }

      $.ajax({
        url: headerModel.api + '/Buy/Reservation',
        data: {
          "num":  _this.part,
          "projectid": _this.proId,
          "token": headerModel.token
        },
        type: 'post',
        success: function (response) {
          _this.formLock = false;
          headerModel.loading = false;
          if (response.resultid == 200) {
            // 提交成功跳转到预约成功页面
            DGDTOOLS.tip._tip('预约成功!!!', function () {
            window.location.href = "complete?proId="+ _this.proId;
            })

          } else {
            DGDTOOLS.tip._tip(response.message)
          }
        },
        error: function (e) {
          _this.formLock = false;
          headerModel.loading = false;
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })

    }
  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.proId = window.location.search.split('id=')[1] || 0;
    if (this.proId == 0) {
      window.location.href = "../project/index.html"
    }
    this.getBuyInfo();
  }
})