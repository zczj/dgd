var headerModel = new Vue({
    el: "#header",
    data: {
      tag: false,
      navs: [
        '首页',
        '投资项目',
        '股权转让',
        '质押贷款',
        '新手指引',
        '关于我们'
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
      this.userInfo=JSON.parse(DGDTOOLS.store._fetchone('userInfo'));
    }


  })
