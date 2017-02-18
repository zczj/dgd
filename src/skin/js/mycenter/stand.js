/**
 * 个人中心我的站岗宝
 */
var standModel = new Vue({
  el: '#stand',
  data: {
    standInfo: '', // 站岗宝信息
    pageSize: 4, // 每页显示条数
    curPage: 1, // 当前页
    // totalPage: 8, // 总页数
    list: '',
    type: 0,
    tabs: ['全部','转入记录', '转出记录','收益记录'], // 活期
    typeMap: [0, 1, 2, 3], // 活期query type
    CacheList: {}, // 缓存 活期list
    isShow:false // 活期定期显示锁
  },
  computed: {
    // 分页数组
    PagesIndex: function () {
      return DGDTOOLS.Ev._setPage(this.totalPage, this.curPage);
    },
    // 总页数
    totalPage: function () {
      return Math.ceil(this.standInfo.pagecount / this.pageSize);
      // return 15;
    }
  },
  methods: {
    /**
     * 获取站岗宝信息
     * @param type [区分加载loading动画]
     * @param type2 [区分Pc和Mobile 分页展示]
     */
    getStandInfo: function (type, type2) {
      var _this = this;
      type ? headerModel.loading = true : $("#loader").fadeIn(300);


      $.ajax({
        url: headerModel.api + '/MyCenter/GetStandGuardInfo',
        data: {
          "Token": headerModel.token,
          "PageSize": this.pageSize,
          "CurrentPage": this.curPage
        },
        type: 'post',
        success: function (response) {

          type ? headerModel.loading = false : $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            _this.standInfo = response;
            if (type2) {
              _this.list = _this.list.concat(response.StandguardList)

            } else {
              _this.list = response.StandguardList;
            }
            // 缓存数据
            _this.saveCacheList(_this.type, _this.list);
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          type ? headerModel.loading = false : $("#loader").fadeOut(300)
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    /* 翻页事件 */
    pageClick: function (index, type) {
      if (index != this.curPage) {
        this.curPage = index;
        type ? this.getStandInfo(1, 'mb') : this.getStandInfo(1);
      }
    },
    /**
     * 根据分类请求数据
     */
    queryList: function (type,i) {
      var _this = this;
      _this.type = type;
      $(_this.$refs['tab-btns']).eq(i).addClass('cur').siblings().removeClass('cur');
      console.log(i)
      // 检查当前分类是否有缓存数据
      if (_this.CacheList[_this.type]) {
        _this.list = _this.CacheList[_this.type].list
        _this.curPage = _this.CacheList[_this.type].curPage
        _this.totalPage = _this.CacheList[_this.type].totalPage
        _this.PagesIndex = _this.CacheList[_this.type].PagesIndex
      } else {
        _this.curPage = 1;
        _this.getStandInfo(1, 0, _this.type);
      }
    },
    /**
     * 缓存数据
     * @param type [数据分类]
     * @param type [区分Pc和Mobile]
     * @param array [要缓存的数据]
     */
    saveCacheList: function (type, array) {
      //  1.1: 首次缓存
      if (!this.CacheList[type]) {
        this.CacheList[type] = {}
        this.CacheList[type].list = [];
      }else{
        this.CacheList[type].curPage=this.curPage;
      }
      //  1.2: 再次缓存
      this.list = this.CacheList[type].list = array;
        this.CacheList[type].curPage = this.curPage;      
      this.CacheList[type].totalPage= this.totalPage;
      this.CacheList[type].PagesIndex = this.PagesIndex;
    }
    
  },
  mounted: function () {
    this.getStandInfo()
  }
})