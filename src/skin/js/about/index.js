var aboutModel = new Vue({
  el: '#about',
  data: {},
  methods: {
    // 手机端轮播方法
    mobileSliderFn: function() {
      $('.owl-carousel').owlCarousel({
        items: 1,
        loop: true
      })
    },
    // PC端轮播方法
    PCSliderFn: function() {
      new posterTvGrid('posterTvGrid', {
        className: "posterTvGrid",
        //- height: 390
      }, [{
        "img": "/skin/img/about/index-slider1.png",
        "title": "",
        "url": "#"
      }, {
        "img": "/skin/img/about/index-slider2.png",
        "title": "",
        "url": "#"
      }, {
        "img": "/skin/img/about/index-slider3.png",
        "title": "",
        "url": "#"
      }, {
        "img": "/skin/img/about/index-slider1.png",
        "title": "",
        "url": "#"
      }]);
    },
    // 添加反馈
    addFeedBack: function() {
      var feedBackContent = this.$refs.feedBackContent
      if (feedBackContent.value == '') {
        feedBackContent.focus()
        return false
      }
      // 提交反馈
      if (headerModel.token) {
        this.sendPost(feedBackContent.value)
      } else {
        DGDTOOLS.check._isLogin()
      }
    },
    // 发送请求
    sendPost: function(value) {
      $.ajax({
        url: headerModel.api + '/ZhongChou/AddFeedBack',
        type: 'POST',
        data: {
          "Token": headerModel.token,
          "Content": value,
          "Source": ""
        },
        success: function(res) {
          if (res && res.resultid == 200) {
            alert('提交成功')
          }
        }
      })
    }
  },
  mounted: function() {
    // loading 动画
    $('#loader').fadeOut(300);

    // 轮播图方法
    if (headerModel.isMobileOrTable) {
      // 调用手机端轮播方法
      var script = document.createElement('script'),
        link = document.createElement('link'),
        _this = this
        //- script
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', '/skin/plugs/owl-carousel/owl.carousel.min.js')
      document.querySelector('head').appendChild(script)
        //- style
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('href', '/skin/plugs/owl-carousel/assets/owl.carousel.min.css')
      document.querySelector('head').appendChild(link)
        //-
      link.onload = function() {
        script.onload = function() {
          _this.mobileSliderFn()
        }
      }
    } else {
      // PC端轮播方法
      this.PCSliderFn()
      var script = document.createElement('script'),
        link = document.createElement('link'),
        _this = this
        //- script
        /*script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', '/skin/plugs/poster/posterTvGrid.js')
        document.querySelector('head').appendChild(script)
          //- style
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', '/skin/plugs/poster/posterTvGrid.css')
        document.querySelector('head').appendChild(link)
          //-
        link.onload = function() {
          script.onload = function() {
            _this.PCSliderFn()
          }
        }*/
    }
  }
})