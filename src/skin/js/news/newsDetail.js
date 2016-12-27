/*
* @Author: suzhihui
* @Date:   2016-12-26 15:10:35
* @Last Modified by:   老苏
* @Last Modified time: 2016-12-27 18:19:45
*/

'use strict';

var newsModel = new Vue({
  el:'#model-newsDetail',
  data:{
    // 资讯数据
    newsData: null,

    // 资讯ID
    newsId: '',
    // 推荐项目
    Pro: '',
    //推荐文章
    TopNews:''
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
          }
        }
        $("#loader").fadeOut(300)
      })
    },
    formartDate: function (time) {
      return DGDTOOLS.fT._covnerTimeLine(time);
    },
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
    }
  },
  created: function () {

    this.getIntPro();
    this.getIntNew();
  },
  mounted: function () {
    // 获取url传参过来的资讯id
    this.newsId = window.location.search.split('id=')[1] || 0;
    console.log(this.newsId);
    this.getNews();
  }
})