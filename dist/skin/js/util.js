!function(t){t.extend(jQuery.easing,{elasticOut:function(t,e,n,r,o,i,a){if(0===e)return n;if(1==(e/=o))return n+r;if(a||(a=.3*o),!i||i<Math.abs(r)){i=r;var u=a/4}else var u=a/(2*Math.PI)*Math.asin(r/i);return i*Math.pow(2,-10*e)*Math.sin((e*o-u)*(2*Math.PI)/a)+r+n}})}(jQuery);var Util=function(){function t(){var t={};return t.prototype={_fetch:function(t){return JSON.parse(window.localStorage.getItem(t)||null)},save:function(t,e){window.localStorage.setItem(t,JSON.stringify(e))},clearOne:function(t){window.localStorage.removeItem(t)}}}function e(){var t={};return t.prototype={_convertTime:function(t){var e=(new Date).getTime(),n=t.getTime(),r=(new Date).getFullYear()-t.getFullYear(),o=(new Date).getMonth()-t.getMonth(),i=parseInt((e-n)/1e3),a=Math.floor(i/86400),u=Math.floor((i-24*a*60*60)/3600),c=Math.floor((i-24*a*60*60-3600*u)/60),s=Math.floor(i-24*a*60*60-3600*u-60*c),l={};l.year=r,l.month=o,l.day=a,l.hour=u,l.min=c,l.sec=s;var f=this._cutTime(l);return f},_cutTime:function(t){var e="刚刚";return t.year&&t.year>0?e=t.year+"年前":t.month&&t.month>0?e=t.month+"个月前":t.day&&t.day>0?e=t.day+"天前":t.hour&&t.hour>0?e=t.hour+"小时前":t.min&&t.min>0?e=t.min+"分钟前":e},_covnerTimeLine:function(t){var e=t.split("/").join("-");return e}}}function n(){var t={};return t.prototype={_array:function(t){return"[object Array]"===Object.prototype.toString.call(t)},_isWeixin:function(){var t=window.navigator?window.navigator.userAgent:"",e=/MicroMessenger/i;return!!e.test(t)},_isLogin:function(){!function(t){t.dialog({type:"warning",message:"请先登录！",buttons:[{text:"登录",type:"green",callback:function(){window.location="/passport/login.html?url="+window.location.href}},{text:"取消",type:"red"}],maskClose:!0,effect:!0})}(jQuery)},_isNumPoint:function(t){var e=window.e||t;return e.returnValue=!(!this._isNum(e)&&46!==e.keyCode),e.returnValue},_isNum:function(t){window.e||t;return t.returnValue=!!/[\d]/.test(String.fromCharCode(t.keyCode))},_isPhone:function(t){return/^0?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/.test(t)},_isMobileOrPad:function(){var t=navigator.userAgent.toLowerCase(),e="ipad"==t.match(/ipad/i),n="iphone os"==t.match(/iphone os/i),r="midp"==t.match(/midp/i),o="rv:1.2.3.4"==t.match(/rv:1.2.3.4/i),i="ucweb"==t.match(/ucweb/i),a="android"==t.match(/android/i),u="windows ce"==t.match(/windows ce/i),c="windows mobile"==t.match(/windows mobile/i);return e||n||r||o||i||a||u||c}}}function r(){var t={};return t.loadJsLock=!1,t.prototype={_share:function(t){new iShare({container:t,config:{}})},_createQrcode:function(t,e){var n=window.location.href;e=e?e:8,qr.canvas({canvas:t,value:n,size:e,cb:function(n,r,o){var i=t,a=25;n<25*e-10&&(a=Math.floor((250-n)/2)),i.style.marginLeft=a+"px",i.style.marginTop=a+"px"}})},_loadJS:function(t){if(this.loadJsLock)return null;this.loadJsLock=!0;var e=document.createElement("script");return e.setAttribute("type","text/javascript"),e.setAttribute("src",t),document.querySelector("head").appendChild(e),e}}}function o(){return u.store._fetch("userInfo")}function i(){return $.dialog({type:"ok",message:"退出成功！",delay:1e3,effect:!0}),u.store.clearOne("userInfo")}function a(){var t={};return t.prototype={_tip:function(t,e){$.dialog({type:"warning",message:t,delay:2e3,effect:!0,delayCallback:e&&e()})}}}var u={};return u.store=t(),u.checkLogin=o,u.loginOut=i,u.fT=e(),u.check=n(),u.Ev=r(),u.tip=a(),u};window.DGDTOOLS=Util();