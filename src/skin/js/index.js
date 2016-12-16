$(document).ready(function() {

  //- var transferList = $('#transfer-list');
  //- var oUl = $('#transfer-list ul');
  //- var aLi = oUl.find('li');
  //- oUl.width( aLi.length * (aLi.eq(0).width() + 20 ) -20 +'px');
  //- var scroll = new BScroll(document.getElementById('transfer-list'), {

  //- })


});




var indexModel = new Vue({
  el: '#model-index',
  data: {
    Ad: '',
    TimesRotationMap: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮']
  },
  created: function() {
    this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=3&state=0&currentpage=20&token=' + headerModel.token).then(function(response) {
      this.Ad = response.data;
    })
  },
  updated: function() {
    var _this = this;
    // 退出重置关注状态
    if (!headerModel.isLogin) {
      for (var i = 0; i < indexModel.Ad.projectList.length; i++) {
        console.log(indexModel.Ad.projectList[i].FollowState = false);
      }
    }
    //首页轮播图
    ;(function () {
      var dgdAd = $('#dgd-ad');
      dgdAd.owlCarousel({
        singleItem: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true
      });
    })('首页轮播图');


    //合作伙伴
    ;(function () {
      var owl = $('#player-list');
      owl.owlCarousel({
        items: 5, //10 items above 1000px browser width
        itemsDesktop: [1000, 5], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 4], // betweem 900px and 601px
        itemsTablet: [600, 3], //2 items between 600 and 0
        itemsMobile: [480, 2] // itemsMobile disabled - inherit from itemsTablet option
      });
      $('.next-btn').click(function() {
        owl.trigger('owl.next');
      })
      $('.prev-btn').click(function() {
        owl.trigger('owl.prev')
      });
    })('合作伙伴');

    //公告
    ;(function() {
      _this.ggSlider();
    })('公告');

  },
  methods: {
    //关注
    gz: function(id, i) {
      var _this = this;
      if (!headerModel.isLogin) {;
        (function($) {
          $.dialog({
            type: 'warning',
            message: '请先登录！',
            buttons: [{
              text: '登录',
              type: 'green',
              callback: function() {
                window.location = '/passport/login.html';
              }
            }, {
              text: '取消',
              type: 'red'
            }],
            maskClose: true,
            effect: true
          })
        })(jQuery);
        return;
      }
      $("#loader").fadeIn(300);
      var state = this.Ad.projectList[i].FollowState = !this.Ad.projectList[i].FollowState;
      state ? state = 1 : state = 0;

      $.ajax({
        url: headerModel.api + '/MyCenter/AddFollow',
        data: {
          'projectid': id,
          'type': state,
          'token': headerModel.token
        },
        type: 'post',
        success: function(response) {
          $("#loader").fadeOut(300);
          if (response.resultid == 200) {
            console.log(response.message ? response.message : '已关注');
          }
        },
        error: function() {
          $("#loader").fadeOut(300);
        }
      })
    },
    //公告滚动
    ggSlider: function () {
      if (headerModel.isMobileOrTable) {
        var oDiv = document.querySelector('#ggSlider');
        var oUl = oDiv.getElementsByTagName('ul')[0];
        var iH = oUl.getElementsByTagName('li')[0].clientHeight;
        var iNow = 0;
        var timer = null;

        function slider(num) {
          iNum += num;
          if ( Math.abs(iNow) > arrData.length-1 ) {
            iNow = 0;
          }
          oUl.stop().animate({ 'top': iH*iNow }, 2200, 'elasticOut');
        }


      }else{
        return;
      }
    }
  }
})