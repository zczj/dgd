/**
 * 首页js
 */

var plats=[{
  src:'/skin/img/Cooperation/tsk_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/dwc_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/tne_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/myts_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/qlg_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/zmzj_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/hmgs_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/zck_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/thw_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/djt_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/dcw_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/hxjh_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/yht_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/hyzc_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/mxd_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/tc_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/tsj_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/kt_Jc.jpg'
},
{
  src:'/skin/img/Cooperation/tzw_Jc.jpg'
},]


var indexModel = new Vue({
  el: '#model-index',
  data: {
    Ad: '',
    TimesRotationMap: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
    //资讯列表
    list: [],
    CacheList:{},
    tabs:[ '众筹', '政策', '国际', '研究', '创投'],
    CategoryMap: ['53','54','55','56','57'],
    currentpage: 1,
    pageSize: 3,
    cat: '53',
    fcLink:'', // 友情链接
    transferList: '', // 转让列表
    authen:'', // 认证人信息
    plat: plats
  },
  created: function() {
    this.getAd();
    this.getNewsList();
    this.getFriendLink();
    this.getAuthen();
    this.getCession();
    
  },
  updated: function() {
    var _this = this;
    // 退出重置关注状态
    if (!headerModel.isLogin && _this.Ad.projectList) {
      for (var i = 0; i < _this.Ad.projectList.length; i++) {
        console.log(_this.Ad.projectList[i].FollowState = false);
      }
    }
    
    ;(function  () {
      // var owl = $('#transfer-list');
      // owl.owlCarousel({
      //   items: 4,
      //   nav: false,
      //   height:320,
      //   margin: 10,
      //   responsiveClass:true,
      //   responsive: {
      //     480:{
      //       items:2
      //     },
      //     780:{
      //       items:3,
      //     },
      //     900:{
      //       items:4,
      //     },
      //     1100:{
      //       items: 5,
      //     }
      //   }
      // });
    })('转让列表');


    //公告
    ;(function() {
       _this.ggSlider();
    })('公告');



  },
  methods: {
    // 首页轮播图
    bannerSlider: function () {
      var dgdAd = $('#dgd-ad');
      dgdAd.owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true
      });
    },
    transferSlider: function  () {
      var transferS = $('#transfer-list');
      transferS.owlCarousel({
        items: 4,
        nav: false,
        height:320,
        margin: 10,
        responsiveClass:true,
        responsive: {
          0:{
            items:1.5
          },
          320:{
            items:1.5
          },
          480:{
            items:2
          },
          800:{
            items:3,
          },
          1100:{
            items: 4,
          }
        }
      });
    },
    playerSlider: function  () {
     var owl = $('#player-list');
      owl.owlCarousel({
        items: 5,
        nav: false,
        responsiveClass:true,
        responsive: {
          0:{
            items:2
          },
          480:{
            items:2
          },
          600:{
            items:3,
          },
          780:{
            items:4,
          },
          1000:{
            items: 5,
          }
        }
      });
      $('.next-btn').click(function() {
        owl.trigger('next.owl.carousel');
      })
      $('.prev-btn').click(function() {
        owl.trigger('prev.owl.carousel')
      });
    },
    mouse:function  (i) {
      $(this.$refs.trList[i]).addClass('cur');
    },
    mouseOut:function  (i) {
      $(this.$refs.trList[i]).removeClass('cur');
    },
    getAd: function  () {
      $('#loader').fadeIn(300);
      this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=3&state=0&currentpage=20&token=' + headerModel.token).then(function (response) {
        if(response.data){
          this.Ad = response.data;
        }
        $('#loader').fadeOut(300);
        this.$nextTick(function () {
            this.bannerSlider();
            this.playerSlider();
          });
      })
    },
    //公告滚动
    ggSlider: function () {
      var _this = this;
      var oDiv = $('#ggSlider');
      var oUl = oDiv.find('ul');
      var iH = oUl.find('li:first').height();
      var iNow = 0;
      oDiv.timer = null;
      if (headerModel.isMobileOrTable) {

        function slider(num) {
          iNow += num;
          if ( Math.abs(iNow) > _this.Ad.NoticeList.length-1 ) {
            iNow = 0;
          }
          oUl.stop().animate({ 'top': iH*iNow }, 2200,'elasticOut');
        }
        oDiv.hover(function (){
          clearInterval( oDiv.timer );
        }, autoPlay);

        function autoPlay() {
          oDiv.timer = setInterval(function () {
            slider(-1);
          },2000);
        }
        autoPlay();

      }else{
        clearInterval( oDiv.timer );
        return;
      }
    },
    // 新闻资讯
    getNewsList: function (category) {
      console.log(category);
      if (category == undefined) {
        headerModel.loading=false;
        $('#loader').fadeIn(300);
      }else{
        headerModel.loading=true;
      }
      var ca = category!== undefined ? category:this.cat;

      this.$http.get(headerModel.api + '/News/GetList?token='+ headerModel.token +'&category='+ca+'&newkey=0&pagesize='+ this.pageSize +'&currentpage='+ this.currentpage).then(function(response) {
          this.list = response.data;

          this.pagination = response.data.pagecount;
          this.saveCacheList(ca,response.data.NewsList);
          //this.isLastPage = this.checkLastPage()
          // this.$nextTick(function () {
          //   this.bannerSlider();
          // });

        headerModel.loading=false;
         $('#loader').fadeOut(300);
      })
    },
    getCession: function  () {
      var _this = this;
      _this.$http.get(headerModel.api + '/ZhongChou/GetCessionList?currentPage=1&PageSize=5').then(function (response) {
        if(response.data){
          _this.transferList = response.data;
          _this.$nextTick(function  () {
            _this.transferSlider();
          });
        }
      },function(response) {
        console.log(response.status);
      })
    },
    // 友情链接
    getFriendLink: function  () {
      $('#loader').fadeIn(300);
      this.$http.get(headerModel.api + '/FriendLink/Get').then(function (response) {
        if(response.data){
          this.fcLink = response.data;
        }
        $('#loader').fadeOut(300);
      
      })
    },
    /**
     * 资讯列表 tab切换
     * @Author: 老苏
     * @param   {sting} cat 分类
     * @param   {Int} i 索引
     * @return  {null}     无返回值
     */
    tabFn: function (cat, i) {
      var _this = this;
      _this.cat = cat;
      $(_this.$refs['tab-btns']).eq(i).addClass('cur').siblings().removeClass('cur');

      // 检查当前分类是否有缓存数据
      if (_this.CacheList[_this.cat]) {
        _this.list = _this.CacheList[_this.cat].list
        _this.currentpage = _this.CacheList[_this.cat].curPage
        _this.pagination = _this.CacheList[_this.cat].pagination

      }else{
        _this.currentpage = 1;
        _this.getNewsList(_this.cat);
      }
      // 最后一页
      //this.isLastPage = this.checkLastPage();
    },
    //缓存数据
    saveCacheList:function (ca,array) {
      if (this.CacheList[ca]=== undefined) {
        this.CacheList[ca]={};
        this.CacheList[ca].list=[];
        this.list = this.CacheList[ca].list=array;
      }else{
        this.list = this.CacheList[ca].list=this.CacheList[ca].list.concat(array);
      }
      this.CacheList[ca].curPage=this.currentpage;
      this.CacheList[ca].pagination= this.pagination;

    },
    //推荐文章发布时间格式化
    timeFormart: function (time) {
      var t1 = new Date(time);
      return DGDTOOLS.fT._convertTime(t1);
    },
    //返回自定义图片尺寸
    resizeImg: function (url,width,height) {
      if (url) {
        var result = url.split('@')[0] +'@1e_1c_0o_0l_'+ height +'h_'+width+'w_90q.src';
      }
      return result;
    },
    // 获取认证信息
    getAuthen: function() {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/Pay/QueryAuthenticator?token=' + headerModel.token).then(function(response) {
        $('#loader').fadeOut(300);
        this.authen = response.data.State
      })
    },
    buyNow: function(id, index) {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {;
        DGDTOOLS.check._isLogin();
        return;
      } else {
        // 是否认证投资人        
        if (!this.authen) {
          DGDTOOLS.tip._tip('请认证投资人！', function() {
            var url = window.location.href;
            window.location.href = 'http://test.dgd.vc/mycenter/authentication?url=' + window.location.href;
          });
          return;
        }

        // 预约项目
        if (_this.list[index].ISReservation) {
          window.location.href = "/reservation/index?id=" + id
        } else {
          window.location.href = "/order/index?id=" + id
        }
      }
    },
  }
})