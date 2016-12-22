$(window).load(function () {
  $('#loader').delay(800).fadeOut(300);
})

;(function ($) {
  $.extend(jQuery.easing,{
    elasticOut: function(x,t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
      if (t === 0) {
        return b;
      }
      if ( (t /= d) == 1 ) {
        return b+c;
      }
      if (!p) {
        p=d*0.3;
      }
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else {
        var s = p/(2*Math.PI) * Math.asin (c/a);
      }
      return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }

  });
})(jQuery);

var Util=function () {
  //写入缓存
  function store() {
    var Store = {}
    return Store.prototype = {
      _fetch: function (key) {
        // return JSON.parse(window.localStorage.getItem(key) || '[]');
        return JSON.parse(window.localStorage.getItem(key) || null);
      },
      save: function (key, items) {
        window.localStorage.setItem(key, JSON.stringify(items))
      },
      clearOne: function (key) {
        window.localStorage.removeItem(key);
      }
    }
  }
  //检测登录
  function checkLogin() {
    return Tools.store._fetch('userInfo');
  }
  //登出
  function loginOut() {
    $.dialog({
      type: 'ok',
      message: '退出成功！',
      delay: 1000,
      effect: true
    })
    return Tools.store.clearOne('userInfo');
  }
  var Tools = {};
  return Tools.store = store(),
         Tools.checkLogin = checkLogin,
         Tools.loginOut = loginOut,
         Tools
}

window.DGDTOOLS=Util();