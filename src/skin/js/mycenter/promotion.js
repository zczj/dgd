var promotionModel = new Vue({
  el: '#promotion',
  data: {
    showDialog: false,
    currentpage: 1,
    pagesize: 5,
    promotion: '',
    rebate: [],
    moreRebate: [],
    rebateCount: 0,
    getMore: '查看更多'
  },
  methods: {
    // 获取邀请码和邀请链接
    getPromotionCode: function() {
      var url = headerModel.api + '/MyCenter/GetPromotionCode?token=' + headerModel.token;
      this.$http.get(url).then(function(res) {
        this.promotion = res.data;
      })
    },
    // 获取返利信息
    GetRebate: function() {
      var _this = this;
      $.ajax({
        url: headerModel.api + '/MyCenter/GetRebate',
        data: {
          "currentpage": _this.currentpage,
          "pagesize": _this.pagesize,
          "token": headerModel.token
        },
        type: 'POST',
        success: function(res) {
          if (res.resultid == 200) {
            // this.list = this.projectdata.concat(response.data.projectList)
            _this.rebateCount = res.RowCount;
            if (!res.RebateList.length) {
              _this.getMore = '没有更多数据'
              return false;
            }
            _this.rebate = _this.moreRebate.concat(res.RebateList);
          }
        }
      })
    },
    // 获取更多返利信息
    getMoreRebate: function() {
      if (this.moreRebate == this.rebate) {
        return false;
      }
      this.moreRebate = this.rebate;
      this.currentpage++;
      this.GetRebate();
    }
  },
  mounted: function() {
    this.getPromotionCode();
    this.GetRebate();
  }
});



var clipboard = new Clipboard('.button');

clipboard.on('success', function(e) {
  console.info('Action:', e.action);
  console.info('Text:', e.text);
  console.info('Trigger:', e.trigger);
  promotionModel.showDialog = true;
  e.clearSelection();
});