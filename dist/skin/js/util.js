
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
  // 时间
  function time() {
    var Ft = {};
    return Ft.prototype = {
      // 转换时间 年/月/日 时：分：秒
      _convertTime: function (date) {
        var now = new Date().getTime();
        var t1 = date.getTime();
        var year = new Date().getFullYear() - date.getFullYear();
        var month = new Date().getMonth() - date.getMonth();
        var leftsecond = parseInt((now - t1)/1000);
        var day=Math.floor(leftsecond/(60*60*24));
        var hour=Math.floor((leftsecond-day*24*60*60)/3600);
        var minute=Math.floor((leftsecond-day*24*60*60-hour*3600)/60);
        var second=Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60);
        var cutTime = {};
        cutTime.year=year;
        cutTime.month=month;
        cutTime.day=day;
        cutTime.hour=hour;
        cutTime.min=minute;
        cutTime.sec=second;
        var result = this._cutTime(cutTime);

        return result ;
      },
      // 转换时间 **前
      _cutTime: function (cutTime) {
        var str = '刚刚';
        if (cutTime.year && cutTime.year > 0) {
          return str = cutTime.year + '年前';
        }
        if (cutTime.month && cutTime.month > 0) {
          return str = cutTime.month + '个月前';
        }
        if (cutTime.day && cutTime.day > 0) {
          return str = cutTime.day + '天前';
        }
        if (cutTime.hour && cutTime.hour > 0) {
          return str = cutTime.hour + '小时前';
        }
        if (cutTime.min && cutTime.min > 0) {
          return str = cutTime.min + '分钟前';
        }
        return str;
      },
      // 转换日期格式 "年-月-日"
      _covnerTimeLine: function (date) {
        var str = date.split('/').join('-');
        return str;
      }
    }

  }
  // 检测类
  function check() {
    var Check = {}
    return Check.prototype = {
      // 是否为数组
      _array:function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      },
      // 是否为微信浏览
      _isWeixin:function () {
        var userAgentString = window.navigator ? window.navigator.userAgent : "";
        var weixinreg = /MicroMessenger/i;
        var androidreg = /android/i;
        if (!weixinreg.test(userAgentString) ) {
            return false;
        }
        return true;
      },
      // 是否为登录状态 不是跳转到登录页面
      _isLogin: function () {
        (function($) {
            $.dialog({
              type: 'warning',
              message: '请先登录！',
              buttons: [{
                text: '登录',
                type: 'green',
                callback: function() {
                  window.location = '/passport/login.html?url='+window.location.href;
                }
              }, {
                text: '取消',
                type: 'red'
              }],
              maskClose: true,
              effect: true
            })
          })(jQuery);
      }
    }
  }
  // 事件
  function createObj() {
    var Ev = {}
    Ev.loadJsLock = false;
    return Ev.prototype = {
      // 分享：https://github.com/zhansingsong
      _share: function (ele) {
        new iShare({
          container: ele,
          config:{
            // title: 'title',//分享标题. 默认：document.title
            // description: 'description',//分享描述文本. 默认：meta的description
            // url: 'url',//分享的URL. 默认：location.href
            // initialized: true,//自动创建必须开启字段. isAbroad，isTitle才能生效.默认开启
            // isAbroad: false,
            //默认undefined，开启国外分享接口 + 国内分享接口.
            //为true时，开启国外分享接口: 'iShare_facebook','iShare_linkedin','iShare_twitter','iShare_googleplus','iShare_tumblr','iShare_pinterest'.
            //为false时，开启国内分享接口：'iShare_weibo','iShare_qq','iShare_wechat','iShare_tencent','iShare_douban','iShare_qzone','iShare_renren','iShare_youdaonote'.
            // isTitle: true,//开启title提示, 默认是false.
          }
        })
      },
      /**
       * 生成关于window.location.href二维码
       * @Author: 老苏
       * @param   {[type]} ele  [容器元素]
       * @param   {num} size 二维码大小 默认值 8
       * @return  {无返回值 }      [description]
       */
      _createQrcode:function (ele,size) {
        var shareUrl = window.location.href
        size=size?size:8;
        qr.canvas({
          canvas: ele,
          value: shareUrl,
          size: size,
          cb: function(width, len, px) {
              var el = ele;
              var val = 25;
              if (width < (25*size - 10)) {
                  val = Math.floor((250 - width) / 2);
              }
              el.style.marginLeft = val+"px";
              el.style.marginTop = val+"px";
          }
        });
      },
      // 动态加载js
      _loadJS: function (url) {
        if (!this.loadJsLock) {
          this.loadJsLock = true;
          var script=document.createElement('script')
          script.setAttribute('type','text/javascript')
          script.setAttribute('src', url)
          document.querySelector('head').appendChild(script);
          return script;
        }else{
          return null;
        }
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
         Tools.fT = time(),
         Tools.check = check(),
         Tools.Ev = createObj(),
         Tools
}

window.DGDTOOLS=Util();