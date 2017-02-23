// 个人中心左侧栏数据
var mySideModel = new Vue({
  el: '#model-side',
  data: {
    userBaseInfo: '', // 个人用户信息
  },
  computed:{
    getCurIndex: function(){
      var curObj = document.getElementById('setCurIndex');
      var res = curObj?curObj.value:'';
      return res;
    },
    getOpenStatus: function  () {
      var group;

      switch(this.getCurIndex){
        case 'Investment':
        case 'Focus':
        case 'Standguardbao' :
          group = 1;
        break;
        default:
          group = 0;
          break;
      }

      return group;
    }
  },
  methods: {
    getUserBaseInfo: function() {
      var _this = this;

      $('#loader').fadeIn(300);
      $.ajax({
        url: headerModel.api + '/MyCenter/UserBaseInfo',
        data: {
          "token": headerModel.token
        },
        type: 'post',
        success: function(response) {
          $('#loader').fadeOut(300);
          if (response.resultid == 200) {
            _this.userBaseInfo = response;
          } else {
            console.log(response.message);
          }
        },
        error: function(e) {
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    navSlideUp: function() {
      $('.dropdown').each(function(i, el) {
        $(el).find('a:first').click(function(e) {
          
          if($(el).hasClass('dropopen')){
            $(el).removeClass('dropopen');
          }else{
            $(el).addClass('dropopen').siblings().removeClass('dropopen')

          }
        })
      })
    }
  },
  mounted: function() {
    if (!DGDTOOLS.checkLogin()) {
      window.location = '/passport/login.html?url=' + window.location.href;
      return false;
    };
    this.getUserBaseInfo();
    this.navSlideUp();
  }
})