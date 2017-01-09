var headerModel = new Vue({
    el: "#header",
    data: {
      tag: false,
      api:'http://devapi.zczj.com:80/api',
      navs: [
        {title:'首页', url:'/index'},
        {title:'投资项目', url:'/index'},
        {title:'股权转让', url:'/index'},
        {title:'质押贷款', url:'/index'},
        {title:'新手指引', url:'/index'},
        {title:'关于我们', url:'/index'}
      ],
      isLogin: false, //是否登录
      userInfo: null,
      token: '',
      loading: false,
      isMobileOrTable: false, // 当前视口宽度是否是处于非PC样式
    },
    computed:{
      // 是否为移动端
      isMobile: function  () {
        return DGDTOOLS.check._isMobileOrPad();
      }
    },
    methods: {
      showMean: function() {
        this.tag = !this.tag;
        document.querySelector('html').className = 'holding'
        document.querySelector('body').className = 'holding'
      },
      closeMean: function() {
        this.tag = !this.tag;
        document.querySelector('html').className = '';
        document.querySelector('body').className = '';
      },
      checkLogin: function(){
        if (DGDTOOLS.checkLogin()) {
          this.isLogin = true;
        }else{
          this.isLogin = false;
        }
      },
      loginOut: function () {
        DGDTOOLS.loginOut();
        this.isLogin =! this.isLogin;
        this.token='';
      },
      //检测视口宽度，
      checkPlat: function (width) {
        if (width <= 800) {
          this.isMobileOrTable = true;
        }else{
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
            state=null;
        //检测登录
        if (!headerModel.isLogin) {
          DGDTOOLS.check._isLogin();
          return;
        }
        $("#loader").fadeIn(300);
        // 布尔值转换 方便传参
        if (item.FollowState) {
          state=1;
        }else{
          state=0
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
            $("#loader").fadeOut(300);
            if (response.resultid == 200) {
              if (response.message == '取消关注') {
                item.FollowState = true;
              }else{
                item.FollowState = false;
              }
            }
          },
          error: function() {
            $("#loader").fadeOut(300);
          }
        })
      }
    },
    created: function () {
      var _this = this;
      this.checkLogin();
      this.userInfo = DGDTOOLS.store._fetch('userInfo');
      this.token = DGDTOOLS.store._fetch('userInfo')?DGDTOOLS.store._fetch('userInfo').token:'';

      this.checkPlat(window.innerWidth);

      window.onresize = function () {
        _this.checkPlat(window.innerWidth)
      }

      $(window).on('scroll', function() {
        if ($(window).scrollTop() >= 40) {
          $(_this.$refs.header).css({
            'top': 0,
            'position':'fixed'
          })
        }else{
          $(_this.$refs.header).css({
            'position': 'static'
          })
        }
      });

    }
  })
