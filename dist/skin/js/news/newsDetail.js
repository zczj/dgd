/*
* @Author: suzhihui
* @Date:   2016-12-26 15:10:35
* @Last Modified by:   老苏
* @Last Modified time: 2016-12-26 16:29:59
*/

'use strict';

var newsModel = new Vue({
  el:'#model-newsDetail',
  data:{
    //资讯ID
    newsId: '',
    // 推荐项目
    Pro: '',
    //推荐文章
    TopNews:''
  },
  methods:{
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
    alert(this.newsId);
  },
  mounted: function () {
    this.newsId = window.location.search.split('id=')[1] || 0;
    alert(this.newsId);
    console.log(this.newsId);
  }
})