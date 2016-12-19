

var qaModel = new Vue({
  el:'#model-qa',
  data:{
    isSearchPop: false
  },
  mounted: function () {
    //问题分类banner
    ;(function () {
      var dgdAd = $('#qa-banner');
      dgdAd.owlCarousel({
        singleItem: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true
      });
    })('问题分类banner');
  },
  methods:{
    searchPop: function () {
      this.isSearchPop = !this.isSearchPop;
    },
    searchClose: function () {
      this.isSearchPop = !this.isSearchPop;
    },
    searchForm: function () {
      var keyword = document.querySelector('#searchKey').value;
      if (keyword == '') {
        $.dialog({
          type: 'warning',
          message: '输入问题关键字',
          delay: 2000,
          effect: true,
          delayCallback: function () {
            document.querySelector('#searchKey').focus();
          }
        })
      }else{

      }
    }
  }
})