var projectDetail = new Vue({
  el: '#detail',
  data: {
    TimesRotation: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
    tabShow: 0, //0: 项目详情 1：项目问答  2：跟投人
    detailNavCur: 0,
    detailNav: false,
    detail: {},
    followPersonList: [],
    projectQAList: {},
    proId:''
  },
  methods: {
    toggleTab: function (index) {
      this.tabShow = index
      if (index === 1){
        this.getProjectQAList()
      } else if (index === 2){
        this.getFollowPerson()
      }
    },
    // 获取投资人列表
    getFollowPerson: function () {
      this.followPersonList = this.detail.FollowPerson
      console.log(this.detail.FollowPerson)
    },
    // 后去问答列表
    getProjectQAList: function () {
      var qaurl = 'http://devapi.zczj.com:80/api/ZhongChou/ProjectQAList?projectid='+this.proId
      this.$http.get(qaurl).then(function (response) {
        console.log(response.data.list)
      })
    },
    // 鼠标滚轮事件
    scroll: function () {
      this.navigatorFn()
      this.navigatorPos()
      this.sidebarPos()
    },
    // 导航事件
    navigatorFn: function () {
      $(window).scroll(function(){
        var $items = $('.item-desc').find('.content-item'),
            $menu = $('.detail-nav'),
            $top = $(document).scrollTop(),
            currentId = '',
            currentLink = $menu.find('.current')
        $items.each(function () {
          var _this = $(this)
          // _this.offset().top代表每一个item的顶部位置
          if ($top > _this.offset().top - 200) {
            currentId = '#' + _this.attr('id')
          } else if (true) {
            // currentId = $items.eq($item.length-1).attr('id')
          } else {
            return false
          }
        })

        if (currentId && currentLink.attr('href') !== currentId) {
          currentLink.removeClass("current")
          $menu.find('[href='+currentId+']').addClass("current")
        }
      })
    },
    // 导航位置
    navigatorPos: function () {
      var _this = this
      $(window).scroll(function () {
        var menu = _this.$refs.detailNav,
            box = _this.$refs.container,
            $top = $(document).scrollTop()
        if ($top > box.offsetTop-400) {
          // menu.style.left = box.offsetLeft - 80 + 'px'
          _this.detailNav = true
        } else {
          _this.detailNav = false
        }
      })
    },
    // 侧边栏位置
    sidebarPos: function () {
      var _this = this
      $(window).scroll(function () {
        var sidebar = _this.$refs.sidebar,
            container = _this.$refs.container,
            $top = $(document).scrollTop()
        container.style.minHeight = sidebar.offsetHeight + 'px';
        if ((container.offsetTop - 76) <= $top) {
          $(sidebar).css({
            'position': 'fixed',
            'width': $(sidebar).parent().width(),
            // 'right': 0,
            'top': 0//$top - container.offsetTop+76
          })
        } else {
          $(sidebar).css({
            'position': 'relative',
            'top': 0
          })
        }
      })
    }
  },
  computed: {
    totalFollowPerson: function () {
      if (!this.detail){
        return this.detail.FollowPerson.length
      }
    }
  },
  mounted: function () {
    //仿路由联调（暂时加一下）套程序后替换。。老苏
    this.proId = window.location.search.split('id=')[1] || 0;
    if(this.proId == 0){
      console.log(2342532352)
      window.location.href='./index.html'
      return false
    }
    $("#loader").fadeIn(300)
    // 获取数据
    var url = 'http://devapi.zczj.com:80/api/ZhongChou/Detail/'+ this.proId +'?token=1'
    this.$http.get(url).then(function (response) {
      this.detail = response.data
      $("#loader").fadeOut(300)
    })
    // 滚动事件
    this.scroll()
  }
})