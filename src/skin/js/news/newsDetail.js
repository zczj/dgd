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
    comTxt: '',
    // 举报类型
    jbType:''



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
      // $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/News/GetComment?ObjectID=news_' + this.newsId).then(function(response) {
        if(response.data){
          this.comment = response.data;
        }
        headerModel.loading=false;
      })
    },
    checkComment: function  (obj) {
      var _this = this;
      if(!headerModel.isLogin){
        DGDTOOLS.check._isLogin();
        return false;
      }
      if(obj.val() == ''){
        DGDTOOLS.tip._tip('请说两句。。。',function  () {
          obj.focus();
        })
        return false;
      }
      return true;
    },
    // 显示二级评论框
    toggleRepay: function  (id,e) {
      var _this = this;
      var appendDiv = $(e.target).parents('.com-cont'),
          subForm = '<div class="com-form"><div class="com-inner"><textarea placeholder="来说两句吧……" value="" class="com-box"></textarea></div> <div class="com-ft clearfix"><!----> <button data-color="#fff">发表评论</button></div></div>';
          if(appendDiv.find('.com-form').length){
            appendDiv.find('.com-form').toggle();
            return;
          }else{
            appendDiv.append(subForm);
          }
          appendDiv.find('button').click(function  () {
            
            _this.comTxt= appendDiv.find('textarea').val();
            console.log(_this.comTxt);
            _this.postComment(id,appendDiv.find('textarea'));
          })
    },
    // 提交评论信息
    postComment: function  (id,obj) {
      var _this = this;
      var pId = id?id:0;
      obj = obj?obj: $(_this.$refs.comTxt);
          _this.comTxt = obj.val();
      // 1.1 检测登录
      if(!_this.checkComment(obj)){
          return
      }
      // newsid = 7431
      headerModel.loading=true;
      $.ajax({
        url: headerModel.api + '/News/AddComm',
        data: {
          "token": headerModel.token,
          "newsid": _this.newsId,
          "Content": _this.comTxt,
          "ParentID": pId,
          "CommentType": "news_"           
        },
        type: 'post',
        success: function (response) {
          headerModel.loading=false;
          if (response.resultid == 200) {
            // 提交评论成功 拼接到二级评论前面。
            obj.val('');
            _this.getComment();

          } else {
            DGDTOOLS.tip._tip(response.message)
          }
        },
        error: function (e) {
          headerModel.loading=false;
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    // 评论点赞
    zanFn:function  (id,index) {
      var _this = this;
      headerModel.loading=true;
      _this.$http.get(headerModel.api + '/News/AddSp?commid='+id).then(function(response) {
        headerModel.loading=false;
        if(response.data.resultid == 200){
          _this.comList[index].Sp=response.data.Sp;
        }else{
          DGDTOOLS.tip._tip(response.data.message)
        }
      })
    },

    // 举报
    jbFn:function  (id) {
      var _this = this;
      // 举报模板
      var jbHtml = '<div ref="jbPop" class="jbPop" style="min-width:300px;">'+
          '<label><input type="radio" name="jbType" value="1" v-model="jbType"><i class="icon icon-os"></i>淫秽色情</label>'+
          '<label><input type="radio" name="jbType" value="2" v-model="jbType"><i class="icon icon-os"></i>广告垃圾</label>'+
          '<label><input type="radio" name="jbType" value="3" v-model="jbType"><i class="icon icon-os"></i>违法作息</label>'+
          '<label><input type="radio" name="jbType" value="4" v-model="jbType"><i class="icon icon-os"></i>其他</label>'+
          '</div>';
      var jbPop = $.dialog({
        // type: 'warning',
        type:'jb-head',
        message: jbHtml,
        buttons:[{
          text: '取消',
          type: 'red'
        },{
          text: '举报',
          type: 'green',
          callback: function(){
            var type = $('.jbPop').find('input:checked').val();
            if(type){
              _this.jbType = type;
              headerModel.loading=true;
              // 提交后台
              $.ajax({
                url: headerModel.api+'/News/Repost',
                data: {
                  "CommentID": id,
                  "Type": type,
                  "token": headerModel.token
                },
                type: 'post',
                success: function  (response) {
                  headerModel.loading=false;
                  if(response.resultid == 200){
                    DGDTOOLS.tip._tip('提交成功！', function  () {
                      jbPop.close();
                    })
                  }else{
                    DGDTOOLS.tip._tip(response.message)
                  }
                },
                error: function (e) {
                  headerModel.loading = false;
                  DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
                  console.error(e.status + ":" + e.responseText);
                }
              })
            }else{
              DGDTOOLS.tip._tip('请选择你的举报内容！')
            }
            return false;
          }
        }],
        maskOpacity: .4,
        effect: true
      })
    }
  },
  computed:{
    /**
     * 返回评论列表
     */
    comList:function  () {
      var comN =[], // 
          comS =[],
          comL = this.comment.ComList?this.comment.ComList:[];
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
              if(comS[i].ParentID == comN[j].CommentID){
                comN[j].comSon.push(comS[i]);
              }
            }
          }

      return comN;
    }
  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.newsId = window.location.search.split('id=')[1] || 0;
    window.onload=function  () {
      setTimeout(function() {
        DGDTOOLS.Ev._share('.item-share');
      }, 2000);
    }
    this.getNews();
    this.getIntPro();
    this.getIntNew();
    this.getComment();
  }
})