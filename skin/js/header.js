var headerModel=new Vue({el:"#header",name:"header",data:{tagl:!1,tagr:!1,api:"https://devapi.zczj.com:4460/api",navs:[{title:"首页",url:"/Index/Index",pathname:"index"},{title:"投资项目",url:"/Project/Index",pathname:"project"},{title:"股权转让",url:"/Transfer/Index",pathname:"transfer"},{title:"新手指引",url:"/Novice/Index",pathname:"novice"},{title:"关于我们",url:"/About/Index",pathname:"about"}],isLogin:!1,userInfo:null,token:"",loading:!1,isMobileOrTable:!1,fromUrl:window.location.href},computed:{isMobile:function(){return DGDTOOLS.check._isMobileOrPad()},currentPage:function(){for(var e=this,t=0,o=window.location.pathname.split("/")[1].toLowerCase(),n=0;n<e.navs.length;n++){if(e.navs[n].pathname==o){t=n;break}t=null}return t}},methods:{showMean:function(e){"l"===e?(this.tagl=!this.tagl,this.tagl?$(".my-side").addClass("meanShow"):$(".my-side").removeClass("meanShow")):this.tagr=!this.tagr,document.querySelector("html").className="holding",document.querySelector("body").className="holding"},closeMean:function(){this.tagl&&(this.tagl=!1,$(".my-side").removeClass("meanShow")),this.tagr&&(this.tagr=!1),document.querySelector("html").className="",document.querySelector("body").className=""},checkLogin:function(){DGDTOOLS.checkLogin()?this.isLogin=!0:this.isLogin=!1},loginOut:function(){DGDTOOLS.loginOut(),this.isLogin=!this.isLogin,this.token=""},checkPlat:function(e){e<=800?this.isMobileOrTable=!0:this.isMobileOrTable=!1},gz:function(e,t){var o=null;return headerModel.isLogin?(headerModel.loading=!0,o=t.FollowState?1:0,void $.ajax({url:headerModel.api+"/MyCenter/AddFollow",data:{projectid:e,type:o,token:headerModel.token},type:"post",success:function(e){headerModel.loading=!1,200==e.resultid&&("取消关注"==e.message?t.FollowState=!0:t.FollowState=!1)},error:function(){headerModel.loading=!1}})):(console.log("1"),void DGDTOOLS.check._isLogin())}},created:function(){var e=this;this.checkLogin(),this.userInfo=DGDTOOLS.store._fetch("userInfo"),this.token=DGDTOOLS.store._fetch("userInfo")?DGDTOOLS.store._fetch("userInfo").token:"",this.checkPlat(window.innerWidth),window.onresize=function(){e.checkPlat(window.innerWidth)},$(window).on("scroll",function(){$(window).scrollTop()>=40?$(e.$refs.header).css({top:0,position:"fixed"}):$(e.$refs.header).css({position:"static"})})}});