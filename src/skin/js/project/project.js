// var projectdata = []
var project = new Vue({
  el: '#project-list',
  name: 'project-list',
  data: {
    projectdata: [],
    TimesRotation: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
    pageSize: 6,
    currentpage: 1,
    state: 0,
    token: 1,
    startPage: 0,
    endPage: 5,
    list: '',
    pagination: '',
    subNavShow: false, // 项目筛选
    prevShow: false,
    nextShow: true,
    ellipsis: false,
    authen: '' // 认证人信息
  },
  methods: {
    //- vue-resource 获取数据
    getData: function() {
      var url = headerModel.api + '/ZhongChou/GetList?pagesize=' + this.pageSize + '&state=' + this.state + '&currentpage=' + this.currentpage + '&token=' + this.token
      $("#loader").fadeIn(300)
      this.$http.get(url).then(function(response) {
        this.list = this.projectdata.concat(response.data.projectList)
        this.pagination = response.data.pagecount
        $("#loader").fadeOut(300)
      })
    },
    // 获取认证信息
    getAuthen: function() {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/Pay/QueryAuthenticator?token=' + headerModel.token).then(function(response) {
        $('#loader').fadeOut(300);
        this.authen = response.data.State
      })
    },
    buyNow: function(id, index) {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {;
        DGDTOOLS.check._isLogin();
        return;
      } else {
        // 是否认证投资人        
        if (!this.authen) {
          DGDTOOLS.tip._tip('请认证投资人！', function() {
            var url = window.location.href;
            window.location.href = 'http://test.dgd.vc/mycenter/authentication?url=' + window.location.href;
          });
          return;
        }

        // 预约项目
        if (_this.list[index].ISReservation) {
          window.location.href = "/reservation/index?id=" + id
        } else {
          window.location.href = "/order/index?id=" + id
        }
      }
    },
    // 下一页
    nextPage: function() {
      this.currentpage++
        this.getList()
    },
    // 上一页
    prevPage: function() {
      this.currentpage--
        console.log(this.currentpage)
      this.getList()
    },
    // 首页
    firstPage: function() {
      this.currentpage = 1
      this.getList()
    },
    // 尾页
    lastPage: function() {
      this.currentpage = this.totalPages.totalPg
      this.startPage = this.currentpage - 5
      this.getList()
    },
    // 页码跳转
    paginationTo: function(index) {
      this.currentpage = index
      this.getList()
    },
    // 最后一页隐藏下一页按钮
    lastPageBtn: function() {
      if (this.currentpage >= this.totalPages.totalPg) {
        this.nextShow = false
        return false
      } else {
        this.nextShow = true
      }
    },
    // 第一页隐藏上一页按钮
    prevPageBtn: function() {
      if (this.currentpage <= 1) {
        this.prevShow = false
        return false
      } else {
        this.prevShow = true
      }
    },
    // 分页数据处理
    getList: function() {
      this.projectdata = []
      if (this.currentpage > this.totalPages.totalPg) {
        // console.log('当前页码超出最大页码范围')
        this.currentpage = this.totalPages.totalPg
        return false
      }
      // console.log('点击前： （开始：'+this.startPage+' - 当前页：'+this.currentpage+'）')
      if (this.currentpage > 3 && this.currentpage < this.totalPages.totalPg) {
        if ((this.currentpage - 3) > this.startPage) {
          this.startPage++
        } else if ((this.currentpage - 3) < this.startPage) {
          this.startPage--
        }
      }
      if (this.currentpage <= 3) {
        this.startPage = 0
      }
      // console.log('点击后： （开始：'+this.startPage+' - 当前页：'+this.currentpage+'）')
      this.prevPageBtn()
      this.lastPageBtn()
      this.getData()
        // console.log(this.totalPages.arr)
    },
    // 移动端加载更多
    loadMore: function() {
      this.projectdata = this.list
      this.currentpage++
        this.getData()
    },
    // 关注
    gz: function(i) {
      console.log(i)
      console.log(this.list[i].FollowState)
    }
  },
  computed: {
    // 总页数
    totalPages: function() {
      var arr = [],
        total = {};
      // 页码总和
      total.totalPg = parseInt(this.pagination / this.pageSize)
        // console.log(total.totalPg)
        // 页码大于5页时，显示省略号
      this.ellipsis = total.totalPg > 5 ? true : false
        // 当页码显示为最后5个时隐藏省略号
      this.ellipsis = this.startPage + 5 >= total.totalPg ? false : true
      for (var i = 1; i <= total.totalPg; i++) {
        arr.push(i)
      }
      // 截取页码数组
      total.arr = arr.slice(this.startPage, this.startPage + 5)

      return total
    }
  },
  // 页码加载时获取数据
  created: function() {
    this.getData()
    this.getAuthen()
  }
})