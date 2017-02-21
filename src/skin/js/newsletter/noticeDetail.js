
var noticeModel = new Vue({
  el: '#notice',
  data: {
    pageSize: 6, // 每页显示条数
    curPage: 1, // 当前页
    NoticeHtml: '',
    NoticeID: ''
  },
  computed: {
    url: function () {
      var res = '';
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].NoticeID == this.NoticeID) {
          res = this.list[i].URL;
        }
      }
      return res;
    }
  },
  methods: {
    getNotice: function () {
      var _this = this;
      $('#loader').fadeIn(300);
      this.$http.get(headerModel.api + '/ZhongChou/GetNotice?currentpage=' + _this.curPage + '&pagesize=' + _this.pageSize).then(function (response) {
        if (response.data) {
          this.list = response.data.NoticeList;
        }
        $('#loader').fadeOut(300);
      })
    },
  },
  mounted: function () {
    var _this = this;
    this.NoticeID = window.location.href.split('?id=')[1] || 0
    this.curPage = window.location.href.split('?curPage=')[1] || 0
    if (this.NoticeID === 0 || this.curPage === 0) {
      window.location.pathname = '/newsletter/notice.html'
    }
    // body
    else {
      this.getNotice();
    }






  }
})
