var promotionModel=new Vue({el:"#promotion",data:{showDialog:!1,currentpage:1,pagesize:5,promotion:"",rebate:[],moreRebate:[],rebateCount:0,getMore:"查看更多"},methods:{getPromotionCode:function(){var e=headerModel.api+"/MyCenter/GetPromotionCode?token="+headerModel.token;this.$http.get(e).then(function(e){this.promotion=e.data})},GetRebate:function(){var e=this;$.ajax({url:headerModel.api+"/MyCenter/GetRebate",data:{currentpage:e.currentpage,pagesize:e.pagesize,token:headerModel.token},type:"POST",success:function(t){if(200==t.resultid){if(e.rebateCount=t.RowCount,!t.RebateList.length)return e.getMore="没有更多数据",!1;e.rebate=e.moreRebate.concat(t.RebateList)}}})},getMoreRebate:function(){return this.moreRebate!=this.rebate&&(this.moreRebate=this.rebate,this.currentpage++,void this.GetRebate())}},mounted:function(){this.getPromotionCode(),this.GetRebate()}}),clipboard=new Clipboard(".button");clipboard.on("success",function(e){console.info("Action:",e.action),console.info("Text:",e.text),console.info("Trigger:",e.trigger),promotionModel.showDialog=!0,e.clearSelection()});