/*
* @Author: suzhihui
* @Date:   2016-12-26 15:10:35
* @Last Modified by:   老苏
* @Last Modified time: 2016-12-28 18:16:05
*/


'use strict';

var newsModel = new Vue({
  el:'#model-newsDetail',
  data:{
    // 资讯数据
    newsData: '',

    // 资讯ID
    newsId: '',
    // 推荐项目
    Pro: '',
    // 推荐文章
    TopNews:'',
    // 显示声明
    Sm: false,
    // 控制web分享显示
    webShare: false,
    // 控制微信端分享显示
    webShareWx: false,
    // 评论
    comment: '',
    // 提交评论
    comTxt: ''



  },
  methods:{
    // 资讯详情
    getNews: function () {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/News/GetNews/'+this.newsId+'?token=' + headerModel.token).then(function(response) {
        if ( response.data) {
          if (response.data.message) {
            console.log(response.data.message);
          }else{
            this.newsData = response.data;
            
            DGDTOOLS.Ev._btnCs();
          }
        }
        $("#loader").fadeOut(300)
      })
    },
    // 资讯收藏
    collection: function () {
      var _this = this;
      var type = _this.newsData.newsinfo.IsCollect?0:1;
      // 检测登录
      if (!headerModel.isLogin) {;
        DGDTOOLS.check._isLogin();
        return;
      }else{
        // 登录状态
        $("#loader").fadeIn(300);
        $.ajax({
          url: headerModel.api + '/MyCenter/AddCollection',
          data: {
            "token": headerModel.token,
            "Object": 1,
            "ObjectID": _this.newsData.newsinfo.NewsID,
            "Title": _this.newsData.newsinfo.newtitle,
            "Remark": "",
            "Type": type
          },
          type: 'post',
          success: function(response) {
            $("#loader").fadeOut(300);
            if (response.resultid == 200) {
              _this.newsData.newsinfo.IsCollect = !_this.newsData.newsinfo.IsCollect;
            }else{
              if (response.message) {
                console.error(response.message );
              }
            }
          },
          error: function() {
            $("#loader").fadeOut(300);
          }
        })
      }
    },
    // 格式化时间
    formartDate: function (time) {
      return DGDTOOLS.fT._covnerTimeLine(time);
    },
    // 格式化关键词
    formartKeyWords: function (str) {
      var res = [];
      return res =str.split('；');
    },
    // 推荐项目
    getIntPro: function () {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=2&state=0&currentpage=1&token=' + headerModel.token).then(function(response) {
        this.Pro = response.data;
        $("#loader").fadeOut(300)
      })
    },
    //推荐文章
    getIntNew: function () {
      // http://devapi.zczj.com:80/api/News/GetTopRecommend?count=5&categoryid=0
      this.$http.get(headerModel.api + '/News/GetTopRecommend?count=10&categoryid=0').then(function(response) {
        this.TopNews = response.data;
      })
    },
    //推荐文章发布时间格式化
    timeFormart: function (time) {
      var t1 = new Date(time);
      return DGDTOOLS.fT._convertTime(t1);
    },
    // 微信分享
    wechat: function () {
      if (DGDTOOLS.check._isWeixin()) {
        this.webShareWx = true;
      }else{
        this.webShare = true;
        var js =new DGDTOOLS.Ev._loadJS('/skin/js/project/qrcode.min.js');
      
        if (js == null) {
          setTimeout(function () {
            DGDTOOLS.Ev._createQrcode(document.querySelector('#canvas'))
          }, 40);
          return;
        }
        js.onload=function () {
          DGDTOOLS.Ev._createQrcode(document.querySelector('#canvas'))
        }

      }
    },
    // 获取评论信息
    getComment: function  () {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/News/GetComment?ObjectID=news_' + this.newsId).then(function(response) {
        if(response.data){
          this.comment = response.data;
        }
        $("#loader").fadeOut(300)
      })
    },
    // 提交评论信息
    postComment: function  () {
      var _this = this;
          _this.comTxt = _this.$refs.comTxt.value;
      // 1.1 检测登录
      if(!headerModel.isLogin){
        DGDTOOLS.check._isLogin();
        return;
      }
      if(this.comTxt == ''){
        DGDTOOLS.tip._tip('请说两句。。。',function  () {
          _this.$refs.comTxt.focus();
          return;
        })
      }
      
      // newsid = 7431

      $.ajax({
        url: headerModel.api + '/News/AddComm',
        data: {
          "token": headerModel.token,
          "newsid": this.newsId,
          "Content": this.comTxt,
          "ParentID": 0,
          "CommentType": "news_"           
        },
        type: 'post',
        success: function (response) {
          if (response.resultid == 200) {
            // 提交成功跳转到订单确认页面，根据定单id
            DGDTOOLS.tip._tip(response.message, function () {
              console.log(response);
            })

          } else {
            DGDTOOLS.tip._tip(response.message)
          }
        },
        error: function (e) {
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    }
  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.newsId = window.location.search.split('id=')[1] || 0;
    this.getNews();
    this.getIntPro();
    this.getIntNew();
    this.getComment();
    window.onload=function () {
      DGDTOOLS.Ev._share('.item-share');
      
    }
  }
})