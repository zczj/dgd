var msgModel=new Vue({el:"#msg-center",data:{list:""},computed:{comList:function(){}},methods:{getMsgList:function(){var e=this;$.ajax({url:headerModel.api+"/MyCenter/GetMessage",data:{Token:headerModel.token,MonthNum:0,currentpage:1,pagesize:3},type:"post",success:function(t){$("#loader").fadeOut(300),200===t.resultid?(e.list=t.response,console.log(e.list)):DGDTOOLS.tip._tip(t.message)},error:function(e){$("#loader").fadeOut(300),DGDTOOLS.tip._tip(e.status+":接口异常"),console.error(e.status+":"+e.responseText)}})},getRepMsg:function(){var e=this;$.ajax({url:headerModel.api+"/MyCenter/GetMessage",data:{Token:headerModel.token,MonthNum:0,currentpage:1,pagesize:3},type:"post",success:function(t){$("#loader").fadeOut(300),200===t.resultid?(e.list=t.response,console.log(e.list)):DGDTOOLS.tip._tip(t.message)},error:function(e){$("#loader").fadeOut(300),DGDTOOLS.tip._tip(e.status+":接口异常"),console.error(e.status+":"+e.responseText)}})}},mounted:function(){this.getMsgList()}});