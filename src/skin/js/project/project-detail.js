var projectDetail = new Vue({
  el: '#detail',
  data: {
    TimesRotation: ['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
    tabShow: 0, //0: 项目详情 1：项目问答  2：跟投人
    detailNavCur: 0,
    detailNav: false,
    shareShow: true,
    isFirstTab: true,
    loading: false,
    wechatShare: false,
    webShare: false,
    detail: '',
    followPersonList: [],
    projectQAList: {},
    proId: ''
  },
  methods: {
    toggleTab: function(index) {
      this.tabShow = index
      if (index === 1) {
        this.getProjectQAList()
      } else if (index === 2) {
        this.getFollowPerson()
      }
    },
    // 获取项目详情信息
    getProjectDetail: function() {
      // 获取数据
      $('#loader').fadeIn("300")
      var url = headerModel.api + '/ZhongChou/Detail/' + this.proId + '?token=1'
      this.$http.get(url).then(function(response) {
        if (response.data) {
          this.detail = response.data
          this.$nextTick(function() {
            this.share()
            this.getPicWidth()
            this.scroll()
            this.resize()
          })
          $('#loader').fadeOut("300")
        }
      })
    },
    // 获取投资人列表
    getFollowPerson: function() {
      this.followPersonList = this.detail.FollowPerson
    },
    // 获取问答列表
    getProjectQAList: function() {
      // 如果有数据就不发请求
      if (!this.isFirstTab) {
        return false
      }
      headerModel.loading = true
      var qaurl = headerModel.api + '/ZhongChou/ProjectQAList?projectid=' + this.proId
      this.$http.get(qaurl).then(function(response) {
        this.projectQAList = response.data.list.reverse()
        headerModel.loading = false
        this.isFirstTab = false
      })
    },
    // 添加留言问答
    AddProjectQA: function() {
      var _this = this,
        qaText = _this.$refs.qaText
        // 判断登录，登录成功后才能留言
      if (!headerModel.isLogin) {
        DGDTOOLS.check._isLogin()
        return false
      }
      // 判断留言内容不能为空
      if (qaText.value === '') {
        $.dialog({
          type: 'warning',
          message: '请填写留言内容',
          delay: 2000,
          maskClose: true,
          effect: true
        })
        this.$refs.qaText.focus()
        return false
      }

      headerModel.loading = true
      var AddProjectQAUrl = headerModel.api + '/ZhongChou/AddProjectQA';
      $.ajax({
        url: AddProjectQAUrl,
        method: 'POST',
        data: {
          "ProjectID": _this.proId,
          "Content": qaText.value,
          "Token": headerModel.token,
          "ParentID": 0
        }
      }).done(function(res) {
        //console.log(res)
        qaText.value = ''
        _this.isFirstTab = true
        _this.getProjectQAList()
        headerModel.loading = false
      })
    },
    // 鼠标滚轮事件
    scroll: function() {
      var sidebar = this.$refs.sidebar,
        height = headerModel.$refs.header.offsetHeight,
        width = document.body.clientWidth || document.documentElement.clientWidth

      if (width >= 900) {
        this.navigatorFn()
        this.navigatorPos()
        this.sidebarPos()
      } else {
        sidebar.style.width = '100%'
        sidebar.style.position = 'static'
      }
      sidebar.style.width = sidebar.parentNode.offsetWidth + 'px'
      if (sidebar.style.position == 'fixed') {
        sidebar.style.top = height + 'px'
      }
    },
    // 导航事件
    navigatorFn: function() {
      $(window).scroll(function() {
        var $items = $('.item-desc').find('.content-item'),
          $menu = $('.detail-nav'),
          $top = $(document).scrollTop(),
          currentId = '',
          currentLink = $menu.find('.current')
        $items.each(function() {
          var _this = $(this)
            // _this.offset().top代表每一个item的顶部位置
          if ($top > _this.offset().top - 200) {
            currentId = '#' + _this.attr('id')
          } else {
            return false
          }
        })

        if (currentId && currentLink.attr('href') !== currentId) {
          currentLink.removeClass("current")
          $menu.find('[href=' + currentId + ']').addClass("current")
        }
      })
    },
    // 导航位置
    navigatorPos: function() {
      var _this = this
      $(window).scroll(function() {
        var menu = _this.$refs.detailNav,
          box = _this.$refs.container,
          $top = $(document).scrollTop()
        if ($top > box.offsetTop - 400) {
          _this.detailNav = true
        } else {
          _this.detailNav = false
        }
      })
    },
    // 侧边栏位置
    sidebarPos: function() {
      var _this = this
      $(window).scroll(function() {
        var sidebar = _this.$refs.sidebar,
          container = _this.$refs.container,
          $top = $(document).scrollTop(),
          header = headerModel.$refs.header.offsetHeight,
          width = document.body.clientWidth || document.documentElement.clientWidth
        if (width >= 900) {
          container.style.minHeight = sidebar.offsetHeight + 'px';
          if ((container.offsetTop - header) <= $top) {
            $(sidebar).css({
              'position': 'fixed',
              'width': $(sidebar).parent().width(),
              'top': header
            })
          } else {
            $(sidebar).css({
              'position': 'relative',
              'top': 0
            })
          }
        }
      })
    },
    // 判断详情图片宽度
    getPicWidth: function() {
      var imgs = $('.item-desc img')
      imgs.each(function() {
        if ($(this).width() > $(document).width()) {
          $(this).parent('p').css('overflow-x', 'auto')
        }
      })
    },
    // 分享
    share: function() {
      DGDTOOLS.Ev._share('.iShare1')
    },
    // 微信分享
    weChatShare: function() {
      if (DGDTOOLS.check._isWeixin()) {
        this.wechatShare = true;
      } else {
        this.webShare = true;
        var js = DGDTOOLS.Ev._loadJS('/skin/js/project/qrcode.min.js');
        if (js == null) {
          setTimeout(function() {
            DGDTOOLS.Ev._createQrcode(document.querySelector('#canvas'))
          }, 40);
          return;
        }
        js.onload = function() {
          DGDTOOLS.Ev._createQrcode(document.querySelector('#canvas'))
        }
      }
    },
    // 窗口缩放
    resize: function() {
      var _this = this
      window.onresize = function() {
        _this.scroll()
      }
    },
    //


  },
  computed: {
    // 计算总的跟投人数
    totalFollowPerson: function() {
      if (this.detail) {
        return this.detail.FollowPerson.length
      }
    }
  },
  mounted: function() {
    var _this = this
      //仿路由联调（暂时加一下）套程序后替换。。老苏
    this.proId = window.location.search.split('id=')[1] || 0;
    if (this.proId == 0) {
      window.location.href = './index.html'
      return false
    }

    // 获取详情
    _this.getProjectDetail()
  }
})