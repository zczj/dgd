$(window).load(function () {
  $('#loader').delay(800).fadeOut(300);
})

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