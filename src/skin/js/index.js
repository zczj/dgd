$(document).ready(function(){

      //- var transferList = $('#transfer-list');
      //- var oUl = $('#transfer-list ul');
      //- var aLi = oUl.find('li');
      //- oUl.width( aLi.length * (aLi.eq(0).width() + 20 ) -20 +'px');
      //- var scroll = new BScroll(document.getElementById('transfer-list'), {

      //- })
      var owl = $('#player-list');
      owl.owlCarousel({
            items : 5, //10 items above 1000px browser width
            itemsDesktop : [1000,5], //5 items between 1000px and 901px
            itemsDesktopSmall : [900,4], // betweem 900px and 601px
            itemsTablet: [600,3], //2 items between 600 and 0
            itemsMobile : [480,2] // itemsMobile disabled - inherit from itemsTablet option
        });
      $('.next-btn').click(function () {
         owl.trigger('owl.next');
      })
      $('.prev-btn').click(function () {
        owl.trigger('owl.prev')
      })

    });

    var modelIndex = new Vue({
      el: '#model-index',
      created: function() {
        this.$http.get(this.urlApi+'/ZhongChou/GetList?pagesize=3&state=0&currentpage=20&token='+ this.token).then(function(response) {
          this.Ad = response.data;
        })
      },
      updated: function () {
        //首页轮播图
        var dgdAd = $('#dgd-ad');
          dgdAd.owlCarousel({
             singleItem:true,
             loop: true,
             autoplay: true,
             autoplayTimeout: 3000,
             autoplayHoverPause: true
          });
      },
      data: {
        Ad: '',
        token:'4433e0fa17fe5933dd9d25df4df409cc',
        TimesRotationMap:['种子期', '天使期', 'pre-A轮', 'A轮', 'B轮', 'C轮'],
        urlApi:'http://devapi.zczj.com:80/api'
      },
      methods: {
        //关注
        gz: function (id,i) {
          if (!DGDTOOLS.checkLogin()) {
            ;(function () {
              $.dialog({
                type: 'warning',
                message: '请先登录！',
                buttons:[{
                  text: '登录',
                  type: 'green',
                  callback: function () {
                    window.location='/passport/login.html';
                  }
                },{
                  text: '取消',
                  type: 'red'
                }],
                maskClose: true
              })
            })(jQuery);
            return;
          }
          $("#loader").fadeIn(300);
          var state = this.Ad.projectList[i].FollowState =!this.Ad.projectList[i].FollowState;
          state?state=1:state=0;
          $.ajax({
            url: this.urlApi + '/MyCenter/AddFollow',
            data: {
              'projectid':id,
              'type':state,
              'token':this.token
            },
            type: 'post',
            success: function (response) {
              $("#loader").fadeOut(300);
              console.log(response);
            }
          })
          // this.$http.post(this.urlApi+'/MyCenter/AddFollow',{
          //   'projectid':1096,
          //   'type':1,
          //   'token':this.token
          // }).then(function (response) {
          //   console.log(response);
          // });
        }
      }
    })

