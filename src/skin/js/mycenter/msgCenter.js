var msgModel = new Vue({
  el: '#msg-center',
  data: {
    list: '',
  },
  computed: {
    comList: function  () {
      // body
    }
  },
  methods: {
    // 获取消息列表
    getMsgList: function () {
      var _this = this;
      $.ajax({
        url: headerModel.api + '/MyCenter/GetMessage',
        data: {
          "Token": headerModel.token,
          "MonthNum": 0,
          "currentpage": 1,
          "pagesize": 3
        },
        type: 'post',
        success: function (response) {
          $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            _this.list = response.response;
            console.log(_this.list)
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          $("#loader").fadeOut(300)
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    // 获取回复消息列表
    getRepMsg: function  () {
      var _this = this;
      $.ajax({
        url: headerModel.api + '/MyCenter/GetMessage',
        data: {
          "Token": headerModel.token,
          "MonthNum": 0,
          "currentpage": 1,
          "pagesize": 3
        },
        type: 'post',
        success: function (response) {
          $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            _this.list = response.response;
            console.log(_this.list)
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          $("#loader").fadeOut(300)
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    }
  },
  mounted: function () {
    this.getMsgList();
  }
})