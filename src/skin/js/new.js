/*
* @Author: suzhihui
* @Date:   2016-12-21 15:19:11
* @Last Modified by:   老苏
* @Last Modified time: 2016-12-21 17:09:08
*/

var newsModel = new Vue({
  el:'#model-news',
  data: {
    //banner
    Ad: ''
  },
  methods: {
    getBanner: function () {
      this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=3&state=0&currentpage=20&token=' + headerModel.token).then(function(response) {
        this.Ad = response.data.ChannelList;
      })
    }
  },
  computed: {

  },
  updated: function () {
    var dgdAd = $('#news-banner');
    dgdAd.owlCarousel({
      items:1,
      loop: true,
      autoplay:false,
      autoplayTimeout:5000,
      autoplayHoverPause:true,
      nav:false
    });
  },
  created: function () {
    this.getBanner();
  }
})