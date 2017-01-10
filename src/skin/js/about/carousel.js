;
(function($) {
  var Carousel = function() {
    console.log('Carousel插件测试')
  }


  Carousel.prototype = {

  }

  Carousel.init = function(posters) {
    var _this = this

    posters.each(function(i, elem) {
      new _this($(this))
    })
  }


  window['Carousel'] = Carousel

})(jQuery);