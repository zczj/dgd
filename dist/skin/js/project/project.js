var project=new Vue({el:"#project-list",name:"project-list",data:{projectdata:[],TimesRotation:["种子期","天使期","pre-A轮","A轮","B轮","C轮"],pageSize:6,currentpage:1,state:0,token:1,startPage:0,endPage:5,list:"",pagination:"",subNavShow:!1,prevShow:!1,nextShow:!0,ellipsis:!1,authen:""},methods:{getData:function(){var t=headerModel.api+"/ZhongChou/GetList?pagesize="+this.pageSize+"&state="+this.state+"&currentpage="+this.currentpage+"&token="+this.token;$("#loader").fadeIn(300),this.$http.get(t).then(function(t){this.list=this.projectdata.concat(t.data.projectList),this.pagination=t.data.pagecount,$("#loader").fadeOut(300)})},getAuthen:function(){$("#loader").fadeIn(300),this.$http.get(headerModel.api+"/Pay/QueryAuthenticator?token="+headerModel.token).then(function(t){$("#loader").fadeOut(300),this.authen=t.data.State})},buyNow:function(t,e){var a=this;return headerModel.isLogin?this.authen?void(a.list[e].ISReservation?window.location.href="/reservation/index?id="+t:window.location.href="/order/index?id="+t):void DGDTOOLS.tip._tip("请认证投资人！",function(){window.location.href;window.location.href="http://test.dgd.vc/mycenter/authentication?url="+window.location.href}):void DGDTOOLS.check._isLogin()},nextPage:function(){this.currentpage++,this.getList()},prevPage:function(){this.currentpage--,console.log(this.currentpage),this.getList()},firstPage:function(){this.currentpage=1,this.getList()},lastPage:function(){this.currentpage=this.totalPages.totalPg,this.startPage=this.currentpage-5,this.getList()},paginationTo:function(t){this.currentpage=t,this.getList()},lastPageBtn:function(){return this.currentpage>=this.totalPages.totalPg?(this.nextShow=!1,!1):void(this.nextShow=!0)},prevPageBtn:function(){return this.currentpage<=1?(this.prevShow=!1,!1):void(this.prevShow=!0)},getList:function(){return this.projectdata=[],this.currentpage>this.totalPages.totalPg?(this.currentpage=this.totalPages.totalPg,!1):(this.currentpage>3&&this.currentpage<this.totalPages.totalPg&&(this.currentpage-3>this.startPage?this.startPage++:this.currentpage-3<this.startPage&&this.startPage--),this.currentpage<=3&&(this.startPage=0),this.prevPageBtn(),this.lastPageBtn(),void this.getData())},loadMore:function(){this.projectdata=this.list,this.currentpage++,this.getData()},gz:function(t){console.log(t),console.log(this.list[t].FollowState)}},computed:{totalPages:function(){var t=[],e={};e.totalPg=parseInt(this.pagination/this.pageSize),this.ellipsis=e.totalPg>5,this.ellipsis=!(this.startPage+5>=e.totalPg);for(var a=1;a<=e.totalPg;a++)t.push(a);return e.arr=t.slice(this.startPage,this.startPage+5),e}},created:function(){this.getData(),this.getAuthen()}});