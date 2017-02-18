var fundManage = new Vue({
  el: '#fundM',
  data: {
    pageSize: 4, // 每页显示条数
    curPage: 1, // 当前页
    Pagedata:'',
    list: '',
    CacheList: {}, // 缓存
    type:3,
    typeMap:[3,1,2],
    tabs: ['资金流水', '充值记录', '提现记录']
  },
  computed: {
    // 分页数组
    PagesIndex: function () {
      return DGDTOOLS.Ev._setPage(this.totalPage, this.curPage);
    },
    // 总页数
    totalPage: function () {
      return Math.ceil(this.Pagedata.pagecount / this.pageSize);
      // return 15;
    }
  },
  methods: {
    /**
     * 获取站岗宝信息
     * @param type [区分加载loading动画]
     * @param type2 [区分Pc和Mobile 分页展示]
     */
    getList: function (t1, t2) {
      var _this = this;
      t1 ? headerModel.loading = true : $("#loader").fadeIn(300);

      $.ajax({
        url: headerModel.api + '/MyCenter/MyFoundsNew',
        data: {
          /**
           * 2:提现记录
           * 3:资金流水
           * 1:充值记录
           */
          "state": _this.type,
          "timeState": 0,
          "Token": headerModel.token,
          "PageSize": this.pageSize,
          "CurrentPage": this.curPage
        },
        type: 'post',
        success: function (response) {

          t1 ? headerModel.loading = false : $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            _this.Pagedata = response;
            if (t2) {
              _this.list = _this.list.concat(response.foundlist)

            } else {
              _this.list = response.foundlist;
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
        type ? this.getList(1, 'mb') : this.getList(1);
      }
    },
    queryList: function (i) {
      var _this = this;
      $(_this.$refs['tab-btns']).eq(i).addClass('cur').siblings().removeClass('cur');
      _this.type = _this.typeMap[i];
      var type =  'type_'+ _this.type;
      // 检查当前分类是否有缓存数据
      if (_this.CacheList[type]) {
        _this.list = _this.CacheList[type].list
        _this.curPage = _this.CacheList[type].curPage
        _this.Pagedata.pagecount = _this.CacheList[type].pagecount;
      } else {
        _this.curPage = 1;
        _this.getList(1, 0);
      }
    },
    /**
     * 缓存数据
     * @param type [数据分类]
     * @param type [区分Pc和Mobile]
     * @param array [要缓存的数据]
     */
    saveCacheList: function (type, array) {
      type = 'type_'+type;
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
      this.CacheList[type].pagecount = this.Pagedata.pagecount;
    }
  },
  mounted: function () {
    this.getList();
  }
})