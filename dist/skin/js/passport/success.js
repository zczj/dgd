var getType=window.location.href.split("?")[1].split("&")[0]||"error";new Vue({el:"#success",data:{formShow:!1,from:!1,number:10,fpwd:!1},computed:{type:function(){return"login"==getType?(this.from=!1,"登录"):"register"==getType?(this.from=!0,"注册"):"fpwd"==getType?(this.fpwd=!0,"找回密码"):void 0},countdown:function(){var e=null,n=this;return e=setInterval(function(){return n.number--,n.number<=0&&clearInterval(e),n.number},1e3)}},mounted:function(){$("#loader").fadeOut(300);var e=null,n=this;e=setInterval(function(){n.number--,n.number<=0&&(clearInterval(e),window.location.href=window.location.search.split("url=")[1]||"/")},1e3)}});