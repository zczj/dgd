/*
* @Author: suzhihui
* @Date:   2016-12-21 15:19:11
* @Last Modified by:   suzhihui
* @Last Modified time: 2016-12-24 20:55:58
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
    cat: '0',
    // 推荐项目
    Pro: '',
    //推荐文章
    TopNews:''
  },

  updated: function () {
    // var dgdAd = this.$refs.slider;
    // alert('laosu');

  },
  computed: {
  },
  methods: {
    getNewsList: function (category) {
      var ca = category!== undefined ? category:'0';
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/News/GetList?token='+ headerModel.token +'&category='+ca+'&newkey=0&pagesize='+ this.pageSize +'&currentpage='+ this.currentpage).then(function(response) {
          this.Ad = response.data;
          this.list = this.list.concat(response.data.NewsList);
          this.pagination = response.data.pagecount
          this.saveCacheList(this.list,ca);
          this.$nextTick(function () {
            this.bannerSlider();
          });

        $("#loader").fadeOut(300)
      })
    },
    // 推荐项目
    getIntPro: function () {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/ZhongChou/GetList?pagesize=2&state=0&currentpage=1&token=' + headerModel.token).then(function(response) {
        this.Pro = response.data;
        $("#loader").fadeOut(300)
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
      // http://devapi.zczj.com:80/api/News/GetTopRecommend?count=5&categoryid=0
      this.$http.get(headerModel.api + '/News/GetTopRecommend?count=10&categoryid=0').then(function(response) {
        this.TopNews = response.data;
      })
    },
    //缓存资讯列表
    saveCacheList: function (array,cat) {
      var _this = this;
      _this.CacheList[cat] = {}
      _this.CacheList[cat].list=array;
      _this.CacheList[cat].curPage=_this.currentpage;
      console.log( _this.CacheList);
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
      $(_this.$refs['tab-btns']).eq(i).addClass('cur').siblings().removeClass('cur');
      if (_this.CacheList[cat]) {
        _this.list = _this.CacheList[cat]
      }else{
        _this.getNewsList(cat);
      }
    },
    // 加载更多
    loadMore: function () {
      var _this = this;
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
    newZan: function (num,i) {
      if ($(this.$refs.iconZan).eq(i).parent('span').hasClass('icon-zaned')) {
        return;
      }
      $("#loader").fadeIn(300)
      var _this = this;
      this.$http.get(headerModel.api+'/News/ClickLike?newsid='+this.list[i].NewsID).then(function (response) {
        if (response.data.resultid == 200) {
          _this.list[i].Pageviews++;
          $(_this.$refs.iconZan).eq(i).parent('span').addClass('icon-zaned')
          $(this.$refs.iconZan).eq(i).css('cursor','not-allowed')
        }
        $("#loader").fadeOut(300)
      })
    }

  },
  created: function () {
    this.getIntPro();
    this.getNewsList();
    this.getIntNew();
  }
})