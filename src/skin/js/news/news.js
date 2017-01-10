/*
* @Author: suzhihui
* @Date:   2016-12-21 15:19:11
* @Last Modified by:   老苏
* @Last Modified time: 2016-12-30 09:50:42
*/

var newsModel = new Vue({
  el:'#model-news',
  data: {
    //资讯列表
    list: [],
    CacheList:{},
    Ad: '',
    tabs:['全部', '众筹', '政策', '国际', '研究', '创投'],
    CategoryMap: ['0','53','54','55','56','57'],
    pageSize: 7,
    currentpage: 1,
    pagination: '',
    isLastPage: false,
    cat: '0',
    // 推荐项目
    Pro: '',
    //推荐文章
    TopNews:''
  },
  methods: {
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
          this.Ad = response.data;

          this.pagination = response.data.pagecount;
          this.saveCacheList(ca,response.data.NewsList);
          this.isLastPage = this.checkLastPage()
          this.$nextTick(function () {
            this.bannerSlider();
          });

        headerModel.loading=false;
         $('#loader').fadeOut(300);
      })
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
    // 推荐项目
    getIntPro: function () {
      this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=2&state=0&currentpage=1&token=' + headerModel.token).then(function(response) {
        this.Pro = response.data;
      })
    },
    // banner
    bannerSlider: function () {
        var dgdAd = $('#news-banner');
        dgdAd.owlCarousel({
          items:1,
          loop: true,
          autoplay:true,
          autoplayTimeout:5000,
          autoplayHoverPause:true,
          nav:false
        });
    },
    //推荐文章
    getIntNew: function () {
      this.$http.get(headerModel.api + '/News/GetTopRecommend?count=10&categoryid=0').then(function(response) {
        this.TopNews = response.data;
      })
    },
    //推荐文章发布时间格式化
    timeFormart: function (time) {
      var t1 = new Date(time);
      return DGDTOOLS.fT._convertTime(t1);
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
      this.isLastPage = this.checkLastPage();
    },
    checkLastPage:function () {
      return this.pagination == this.currentpage;
    },
    // 加载更多
    loadMore: function () {
      var _this = this;
      if (this.checkLastPage()) {
        this.isLastPage = true;
        return;
      }
      this.currentpage ++;
      this.getNewsList(_this.cat)
    },
    //返回自定义图片尺寸
    resizeImg: function (url,width,height) {
      if (url) {
        var result = url.split('@')[0] +'@1e_1c_0o_0l_'+ height +'h_'+width+'w_90q.src';
      }
      return result;
    },
    // 资讯点赞
    newZan: function (i,id) {
      if ($(this.$refs.iconZan).eq(i).parent('span').hasClass('icon-zaned')) {
        return;
      }
      headerModel.loading=true;
      var _this = this;
      this.$http.get(headerModel.api+'/News/ClickLike?newsid='+id).then(function (response) {
        if (response.data.resultid == 200) {
          _this.list[i].Pageviews++;
          $(_this.$refs.iconZan).eq(i).parent('span').addClass('icon-zaned')
          $(this.$refs.iconZan).eq(i).css('cursor','not-allowed')
        }
        headerModel.loading=false;
      })
    }

  },
  created: function () {
    this.getIntPro();
    this.getNewsList();
    this.getIntNew();
  }
})