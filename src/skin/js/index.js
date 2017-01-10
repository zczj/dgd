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
    TimesRotationMap: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
    //资讯列表
    list: [],
    CacheList:{},
    tabs:[ '众筹', '政策', '国际', '研究', '创投'],
    CategoryMap: ['53','54','55','56','57'],
    currentpage: 1,
    pageSize: 3,
    cat: '53'
  },
  created: function() {
    this.getAd();
    this.getNewsList();
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
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true
      });
    })('首页轮播图');


    //合作伙伴
    ;(function () {
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
            items:3
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
    })('合作伙伴');

    //公告
    ;(function() {
      _this.ggSlider();
    })('公告');



  },
  methods: {
    getAd: function  () {
      $('#loader').fadeIn(300);
      this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=3&state=0&currentpage=20&token=' + headerModel.token).then(function (response) {
        this.Ad = response.data;
        $('#loader').fadeOut(300);
      })
    },
    //公告滚动
    ggSlider: function () {
      var _this = this;
      if (headerModel.isMobileOrTable) {
        var oDiv = $('#ggSlider');
        var oUl = oDiv.find('ul');
        var iH = oUl.find('li:first').height();
        var iNow = 0;
        oDiv.timer = null;

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
  }
})