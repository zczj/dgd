$(window).load(function () {
  $('#loader').delay(800).fadeOut(300);
})

var Util=function () {
  //写入缓存
  function store() {
    var Store = {}
    return Store.prototype = {
      _fetch: function (key) {
        return JSON.parse(window.localStorage.getItem(key) || '[]');
      },
      _fetchone: function (key) {
        return window.localStorage.getItem(key)
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
    return Tools.store._fetchone('userInfo');
  }
  //检测登出
  function loginOut() {
    return Tools.store.clearOne('userInfo');
  }
  var Tools = {};
  return Tools.store = store(),
         Tools.checkLogin = checkLogin,
         Tools.loginOut = loginOut,
         Tools
}

window.DGDTOOLS=Util();