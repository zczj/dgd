/*
我的投资
*/

var InvestModel = new Vue({
  el: '#model-index',
  data: {
    mTrans: '',
    pageSize: 4, // 每页显示条数
    curPage: 1, // 当前页
    // totalPage: 8, // 总页数
    list: '',
    contractStatus: ['未签', '已签']
  },
  methods: {
    /* 获取投资列表 */
    getMyTransactions: function (type, type2) {
      var _this = this;
      type ? headerModel.loading = true : $("#loader").fadeIn(300);
      $.ajax({
        url: headerModel.api + '/MyCenter/MyTransactions',
        data: {
          "Token": headerModel.token,
          "state": 0,
          "PageSize": this.pageSize,
          "CurrentPage": this.curPage
        },
        type: 'post',
        success: function (response) {

          type ? headerModel.loading = false : $("#loader").fadeOut(300)
          if (response.resultid === 0) {
            if (type2) {
              _this.list.response = _this.list.response.concat(response.response)
            } else {
              _this.list = response;

            }

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
        type ? this.getMyTransactions(1, 'mb') : this.getMyTransactions(1);
      }
    },
    /**
     * [删除投资订单]
     * @Author: 老苏
     * @param   {[type]} index   [订单id]
     * @param   {[type]} id [当前项目对象]
     * @return  {[type]}      [无]
     */
    delMyTran: function (index, id) {
      // 订单不存在或订单已支付不能删除
      var _this = this;
      headerModel.loading = true;
      $.ajax({
        url: headerModel.api + '/MyCenter/DelOrder',
        data: {
          "Token": headerModel.token,
          "orderid": id,
        },
        type: 'post',
        success: function (response) {

          headerModel.loading = false;
          if (response.resultid === 200) {
           _this.delOrder(index);
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
    delOrder: function (i) {
      this.list.response.splice(i, 1)
    }

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
  mounted: function () {
    this.getMyTransactions();
  }
})