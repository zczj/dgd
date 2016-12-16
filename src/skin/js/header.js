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
      token: ''
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
      }
    },
    created: function () {
      this.checkLogin();
      this.userInfo = DGDTOOLS.store._fetch('userInfo');
      this.token = DGDTOOLS.store._fetch('userInfo')?DGDTOOLS.store._fetch('userInfo').token:'';
    }
  })
