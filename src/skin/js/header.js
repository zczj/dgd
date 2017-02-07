var headerModel = new Vue({
  el: "#header",
  name: 'header',
  data: {
    tagl: false,
    tagr: false,
    api: 'http://devapi.zczj.com:80/api',
    navs: [
      { title: '首页', url: '/Index/Index', pathname: 'index' },
      { title: '投资项目', url: '/Project/Index', pathname: 'project' },
      { title: '股权转让', url: '/Transfer/Index', pathname: 'transfer' },
      { title: '新手指引', url: '/Novice/Index', pathname: 'novice' },
      { title: '关于我们', url: '/About/Index', pathname: 'about' }
    ],
    isLogin: false, //是否登录
    userInfo: null,
    token: '',
    loading: false,
    isMobileOrTable: false, // 当前视口宽度是否是处于非PC样式
    fromUrl: window.location.href
  },
  computed: {
    // 是否为移动端
    isMobile: function() {
      return DGDTOOLS.check._isMobileOrPad();
    },
    // 当前页导航高亮
    currentPage: function() {
      var _this = this,
        index = 0,
        url = window.location.pathname.split('/')[1].toLowerCase();

      for (var i = 0; i < _this.navs.length; i++) {
        if (_this.navs[i].pathname == url) {
          index = i;
          break; // 匹配成功后,跳出for循环
        } else {
          index = null;
        }
      }
      return index;
    }
  },
  methods: {
    showMean: function(tag) {
      if(tag==='l'){
        this.tagl = !this.tagl;
      }else{
        this.tagr = !this.tagr;
      }
      document.querySelector('html').className = 'holding'
      document.querySelector('body').className = 'holding'
    },
    closeMean: function() {
      if(this.tagl){
        this.tagl = false;
      }
      if(this.tagr){
        this.tagr = false;
      }
      document.querySelector('html').className = '';
      document.querySelector('body').className = '';
    },
    checkLogin: function() {
      if (DGDTOOLS.checkLogin()) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
    loginOut: function() {
      DGDTOOLS.loginOut();
      this.isLogin = !this.isLogin;
      this.token = '';
    },
    //检测视口宽度，
    checkPlat: function(width) {
      if (width <= 800) {
        this.isMobileOrTable = true;
      } else {
        this.isMobileOrTable = false;
      }
    },
    /**
     * [gz 关注]
     * @Author: 老苏
     * @param   {[type]} id   [项目id]
     * @param   {[type]} item [当前项目对象]
     * @return  {[type]}      [description]
     */
    gz: function(id, item) {
      var _this = this,
        state = null;
      //检测登录
      if (!headerModel.isLogin) {
        console.log('1');
        DGDTOOLS.check._isLogin();
        return;
      }
      headerModel.loading = true;
      // 布尔值转换 方便传参
      if (item.FollowState) {
        state = 1;
      } else {
        state = 0
      }

      $.ajax({
        url: headerModel.api + '/MyCenter/AddFollow',
        data: {
          'projectid': id,
          'type': state,
          'token': headerModel.token
        },
        type: 'post',
        success: function(response) {
          headerModel.loading = false;
          if (response.resultid == 200) {
            if (response.message == '取消关注') {
              item.FollowState = true;
            } else {
              item.FollowState = false;
            }
          }
        },
        error: function() {
          headerModel.loading = false;
        }
      })
    }
  },
  created: function() {
    var _this = this;
    this.checkLogin();
    this.userInfo = DGDTOOLS.store._fetch('userInfo');
    this.token = DGDTOOLS.store._fetch('userInfo') ? DGDTOOLS.store._fetch('userInfo').token : '';

    this.checkPlat(window.innerWidth);

    window.onresize = function() {
      _this.checkPlat(window.innerWidth)
    }

    $(window).on('scroll', function() {
      if ($(window).scrollTop() >= 40) {
        $(_this.$refs.header).css({
          'top': 0,
          'position': 'fixed'
        })
      } else {
        $(_this.$refs.header).css({
          'position': 'static'
        })
      }
    });

  }
})