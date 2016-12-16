var headerModel = new Vue({
    el: "#header",
    data: {
      tag: false,
      navs: [
        {title:'首页', url:'/index'},
        {title:'投资项目', url:'/index'},
        {title:'股权转让', url:'/index'},
        {title:'质押贷款', url:'/index'},
        {title:'新手指引', url:'/index'},
        {title:'关于我们', url:'/index'}
      ],
      isLogin: true,
      userInfo:null
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
          this.isLogin = false;
        }else{
          this.isLogin = true;
        }
      },
      loginOut: function () {
        DGDTOOLS.loginOut();
        this.isLogin =! this.isLogin;
      }
    },
    created: function () {
      this.checkLogin();
      console.log(this.isLogin);
      this.userInfo = DGDTOOLS.store._fetch('userInfo');
    }
  })
