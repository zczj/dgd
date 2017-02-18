/**
 * 关注项目
 */
var focusModel = new Vue({
  el: '#model-focus',
  data:{
    pageSize: 4, // 每页显示条数
    curPage: 1, // 当前页
    list:'',
    stateMap:['预热中','筹资中','筹集成功']
  },
  computed: {
    // 分页数组
    PagesIndex: function () {
      // DGDTOOLS.EV._setPage(this.totalPage, this.curPage);
     
      return DGDTOOLS.Ev._setPage(this.totalPage, this.curPage);
    },
    // 总页数
    totalPage: function () {
      return Math.ceil(this.list.pagecount / this.pageSize);;
      // return 10;
    }
  },
  methods: {
    /**获取收藏项目列表 */
    getFocusList: function  (type, type2) {
      var _this = this;
      type ? headerModel.loading = true : $("#loader").fadeIn(300);
      $.ajax({
        url: headerModel.api + '/MyCenter/MyProjectFavorites',
        data: {
          "Token": headerModel.token,
          "PageSize": this.pageSize,
          "CurrentPage": this.curPage
        },
        type: 'post',
        success: function (response) {

          type ? headerModel.loading = false : $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            if (type2) {
              _this.list.response = _this.list.response.concat(response.response)
            } else {
              _this.list = response;

            }

          } else {
            DGDTOOLS.tip._tip('错误提示'+response.message);
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
        type ? this.getFocusList(1, 'mb') : this.getFocusList(1);
      }
    },
    del: function (index, id) {
      // 订单不存在或订单已支付不能删除
      var _this = this;
      headerModel.loading = true;
      $.ajax({
        url: headerModel.api + '/MyCenter/AddFollow',
        data: {
          "token": headerModel.token,
          "projectid": id,
          "type":0
        },
        type: 'post',
        success: function (response) {

          headerModel.loading = false;
          if (response.resultid === 200) {
           _this.delFocus(index);
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          headerModel.loading = false;
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    delFocus: function (i) {
      this.list.response.splice(i, 1)
    }
  },
  mounted: function  () {
    this.getFocusList();
  }
})