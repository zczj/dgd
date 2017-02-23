
var noticeModel = new Vue({
  el: '#notice',
  data: {
    pageSize: 10, // 每页显示条数
    list: ''
  },
  computed: {
    // 计算当前页码 及 NoticeID
    urlData: function  () {
      // body
      var res = {};
      var str = window.location.search;
      var arr = str.split('?');
      for(var i = 0; i<arr.length; i++){
        if(arr[i]){
          res[arr[i].split('=')[0]] = arr[i].split('=')[1]
        }
      }
      return res;
    },
    // 计算html
    coverHtml: function  () {
      var res = {};
      
      for(var i= 0; i< this.list.length; i++){
        if(this.list[i].NoticeID == this.urlData.id){
          res.html = this.list[i].Content;
          res.title = this.list[i].Title;
        }
      }

      return res;
    }
    
  },
  methods: {
    getNotice: function () {
      var _this = this;
      $('#loader').fadeIn(300);
      this.$http.get(headerModel.api + '/ZhongChou/GetNotice?currentpage=' + _this.urlData.curPage + '&pagesize=' + _this.pageSize).then(function (response) {
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
      window.location.pathname = '/Newsletter/Notice'
    }
    // body
    else {
      this.getNotice();
    }

    console.log(this.urlData)




  }
})
