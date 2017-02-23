var msgModel = new Vue({
  el: '#msg-center',
  data: {
    list: '',
  },
  computed: {
    /**
     * 返回评论列表
     */
    comList:function  () {
      var comN =[], // 
          comS =[],
          comL = this.list?this.list:[];
          for(var i = 0; i<comL.length; i++){
            // 1.1 父级评论
            if(comL[i].ParentID == 0 ){
              comL[i].comSon=[];
              comN.push(comL[i]);
            }else{
            // 1.2 二级评论
            comS.push(comL[i]);          
            }
          }

          for (var j = 0; j < comN.length; j++) {
            for(var i = 0; i<comS.length;i++){
              if(comS[i].ParentID == comN[j].ID){
                comN[j].comSon.push(comS[i]);
              }
            }
          }

      return comN;
    }
  },
  methods: {
    // 获取消息列表
    getMsgList: function () {
      var _this = this;
      $.ajax({
        url: headerModel.api + '/MyCenter/GetMessageList',
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
            _this.list = response.RelpyList;
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
        url: headerModel.api + '/MyCenter/GetMessageList',
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