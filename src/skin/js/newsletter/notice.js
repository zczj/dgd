
var noticeModel = new Vue({
  el: '#notice',
  data: {
    pageSize: 10, // 每页显示条数
    curPage: 1, // 当前页
    Pagedata: '',
    CacheList: {}, // 缓存
    list: ''
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
    getNotice: function (t1, t2) {
      var _this = this;
      t1 ? headerModel.loading = true : $("#loader").fadeIn(300);

      this.$http.get(headerModel.api + '/ZhongChou/GetNotice?currentpage=' + _this.curPage + '&pagesize=' + _this.pageSize).then(function (response) {
        if (response.data) {
          this.Pagedata = response.data;
          if (t2) {
            _this.list = _this.list.concat(response.data.NoticeList)

          } else {
            _this.list = response.data.NoticeList;
          }

        }
        t1 ? headerModel.loading = false : $("#loader").fadeOut(300)
      })
    },
    /* 翻页事件 */
    pageClick: function (index, type) {
      if (index != this.curPage) {
        this.curPage = index;
        type ? this.getNotice(1, 'mb') : this.getNotice(1);
      }
    },
  },
  mounted: function () {
    // body
    
    
    this.getNotice();
  }
})
