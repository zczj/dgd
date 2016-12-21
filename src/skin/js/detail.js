var detail = new Vue({
  el: '#detail',
  data: {
    TimesRotation: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
    tabShow: 0,
    detailNavCur: 0,
    detail: {},
    followPersonList: [],
    projectQAList: {}
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
      var qaurl = 'http://devapi.zczj.com:80/api/ZhongChou/ProjectQAList?projectid=1234'
      this.$http.get(qaurl).then(function (response) {
        console.log(response.data.list)
      })
    },
    // 详情导航按钮当前高亮切换
    toggleDetailNav: function (index) {
      this.detailNavCur = index
    },
    // 鼠标滚轮事件
    scroll: function () {
      $(window).scroll(function () {
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
    }
  },
  created: function () {
    // 获取数据
    var url = 'http://devapi.zczj.com:80/api/ZhongChou/Detail/1255?token=1'
    this.$http.get(url).then(function (response) {
      this.detail = response.data
    })

    // 滚动事件
    this.scroll();
  }
})
