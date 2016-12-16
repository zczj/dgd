$(document).ready(function() {

  //- var transferList = $('#transfer-list');
  //- var oUl = $('#transfer-list ul');
  //- var aLi = oUl.find('li');
  //- oUl.width( aLi.length * (aLi.eq(0).width() + 20 ) -20 +'px');
  //- var scroll = new BScroll(document.getElementById('transfer-list'), {

  //- })
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
  })
  ;(function () {
    var ggSlider = document.getElementById('ggSlider');
    if (ggSlider.className =='content isMobile') {
      // alert('ok')
    }else{
      // alert('no')
    }
  })('公告');
});
    var IndexModel = new Vue({
      el: '#model-index',
      data: {
        Ad: '',
        token:'',
        TimesRotationMap:['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
        urlApi:'http://devapi.zczj.com:80/api',
        GG: {
          ggList:[],
          ggIsMobile: false
        }
      },
      created: function() {
        //判断登录，
        if (DGDTOOLS.checkLogin()) {
          this.token = DGDTOOLS.store._fetch('userInfo').token;
        }else{
          this.token = '';
        }
        this.$http.get(this.urlApi+'/ZhongChou/GetList?pagesize=3&state=0&currentpage=20&token='+ this.token).then(function(response) {
          this.Ad = response.data;

          //广告列表
          this.GG.ggList = [{
                  url: 'http://www.zczj.com',
                      title: '2016年大股东国庆假期安排公告',
                      data: '1小时前'
                    }
                    ,{
                      url: 'http://www.zczj.com',
                      title: '2016年平区育新站龙旗广场2号楼609室',
                      data: '2小时前'
                    }
                    ,{
                      url: 'http://www.zczj.com',
                      title: '2016年达影院双人情侣券',
                      data: '3小时前'
                    }
                    ,{
                      url: 'http://www.zczj.com',
                      title: '2016年莞出事了，大老虎是谁？',
                      data: '4天前'
                    }
                    ,{
                      url: 'http://www.zczj.com',
                      title: '2016年京初春降雪，天气变幻莫测',
                      data: '5天前'
                    }
                    ,{
                      url: 'http://www.zczj.com',
                      title: '2016年大股东国庆假期安排公告',
                      data: '25天前'
                    }
                ];

        })

      },
      updated: function () {
        var _this = this;

        //首页轮播图
        var dgdAd = $('#dgd-ad');
          dgdAd.owlCarousel({
             singleItem:true,
             loop: true,
             autoplay: true,
             autoplayTimeout: 3000,
             autoplayHoverPause: true
          });
      },
      methods: {
        //关注
        gz: function (id,i) {
          if (!DGDTOOLS.checkLogin()) {
            ;(function ($) {
              $.dialog({
                type: 'warning',
                message: '请先登录！',
                buttons:[{
                  text: '登录',
                  type: 'green',
                  callback: function () {
                    window.location='/passport/login.html';
                  }
                },{
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
          var state = this.Ad.projectList[i].FollowState =!this.Ad.projectList[i].FollowState;
          state?state=1:state=0;
          $.ajax({
            url: this.urlApi + '/MyCenter/AddFollow',
            data: {
              'projectid':id,
              'type':state,
              'token':this.token
            },
            type: 'post',
            success: function (response) {
              $("#loader").fadeOut(300);
            },
            error: function () {
              $("#loader").fadeOut(300);
            }
          })
        }
      }
    })

