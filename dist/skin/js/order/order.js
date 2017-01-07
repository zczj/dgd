var orderModel=new Vue({el:"#model-order",data:{proId:"",buyInfo:"",part:1,selected:"0",amount:0,OrderType:"1",readyRule:!0,formLock:!1,gdCh:!1},methods:{getBuyInfo:function(){var t=this;return headerModel.isLogin?($("#loader").fadeIn(300),void $.ajax({url:headerModel.api+"/Buy/BuyInfo",data:{id:t.proId,token:headerModel.token},type:"post",success:function(o){$("#loader").fadeOut(300),200==o.resultid?(t.buyInfo=o,t.amount=o.project.OriginalLowVote):console.log(o.message)},error:function(t){console.error(t.status+":"+t.responseText)}})):void DGDTOOLS.check._isLogin()},numEv:function(t){return DGDTOOLS.check._isNumPoint(t)},numCh:function(){var t=this;(""==this.amount||this.amount<this.buyInfo.project.OriginalLowVote-0)&&(this.amount=this.buyInfo.project.OriginalLowVote,DGDTOOLS.tip._tip("金额必须大于最低跟投小于最高跟投",function(){t.$refs.amount.focus()}))},partCh:function(){var t=this;(""==t.part||t.part<=0)&&(t.part=1,DGDTOOLS.tip._tip("最低1份起投",function(){t.$refs.part.focus()}))},initCoupon:function(){this.selected="0"},couponCh:function(){var t=this;if("1217"==t.buyInfo.project.ProjectID&&DGDTOOLS.tip._tip("此项目不能使用抵扣劵",this.initCoupon),1==t.buyInfo.project.StandType&&DGDTOOLS.tip._tip("定期项目不能使用优惠劵",this.initCoupon),t.gdCh&&DGDTOOLS.tip._tip("使用了股东劵不能再使用优惠券",this.initCoupon),"抵用券活动"!=t.coupon.Remark){var o=t.amount*t.part,e=t.coupon.Amount;o<1e4&&DGDTOOLS.tip._tip("认投金额小于1万不能使用",this.initCoupon),o>=1e4&&o<2e4?parseInt(e)>50&&DGDTOOLS.tip._tip("投资满1万只可抵扣50元",this.initCoupon):o>=2e4&&o<3e4?parseInt(e)>100&&DGDTOOLS.tip._tip("投资满2万只可抵扣100元",this.initCoupon):o>=3e4&&o<4e4?parseInt(e)>150&&DGDTOOLS.tip._tip("投资满3万只可抵扣150元",this.initCoupon):o>=4e4&&o<5e4&&parseInt(e)>200&&DGDTOOLS.tip._tip("投资满4万只可抵扣200",this.initCoupon)}else o<2e4&&DGDTOOLS.tip._tip("认投金额小于2万不能使用",this.initCoupon)},gdAccountCh:function(){var t=this;"0"!=t.selected&&DGDTOOLS.tip._tip("使用了优惠券不能再使用股东劵",function(){t.gdCh=!1})},partAdd:function(){this.part++},partCut:function(){1!=this.part&&this.part--},nextFn:function(){var t=this;return t.readyRule?(headerModel.loading=!0,void(t.formLock||(t.formLock=!0,$.ajax({url:headerModel.api+"/Buy/OrderCount",data:{Token:headerModel.token,PayMethod:t.orderRule?t.orderRule.Type:"",Num:t.part,ProjectID:t.buyInfo.project.ProjectID,Amount:1*t.amount,Coupon:"0"==t.selected?"":t.selected,IsGDRebate:t.gdCh},type:"post",success:function(o){if(200==o.resultid){if(1*o.PayAmount!==1*t.totleResult)return t.formLock=!1,headerModel.loading=!1,void console.log("校验前台与后台扣费是不一致,请联系管理员");t.formLock=!1,headerModel.loading=!1,$.ajax({url:headerModel.api+"/Buy/PostBuy",data:{ProjectID:t.buyInfo.project.ProjectID,Amount:t.amount,OrderType:1*orderModel.OrderType,ctype:0,pfullname:"",pphone:"",paddress:"",AmountNum:t.part,ckCoupon:"0"==t.selected?"":t.selected,token:headerModel.token,hgadm:"0"==t.gdAccountS?"":t.selected,remark:"",UserID:t.buyInfo.userinfo.UserID,FullName:"",BankAccount:"",Account:"",Phone:"",ReceiveAddress:""},type:"post",success:function(t){200==t.resultid?DGDTOOLS.tip._tip(t.message,function(){window.location.href="orderConf.html?orderId="+t.orderid}):DGDTOOLS.tip._tip(t.message)},error:function(t){DGDTOOLS.tip._tip(t.status+":接口异常"),console.error(t.status+":"+t.responseText)}})}else t.formLock=!1,headerModel.loading=!1,console.log(o.message)},error:function(o){t.formLock=!1,headerModel.loading=!1,DGDTOOLS.tip._tip(o.status+":接口异常"),console.error(o.status+":"+o.responseText)}})))):void DGDTOOLS.tip._tip("请阅读并同意")}},computed:{orderRule:function(){return this.buyInfo.ProjectRule},totleResult:function(){this.coupon.Amount||(this.coupon.Amount=0);var t=parseInt(this.amount)*this.part*1+1*this.manageFree-this.coupon.Amount-this.gdAccountS;return t.toFixed(2)},manageFree:function(){var t=0;return this.amount=isNaN(this.amount)?this.buyInfo.project.OriginalLowVote:this.amount,this.orderRule?(this.buyInfo.ProjectRule.ManagerFee*this.part*this.amount).toFixed(2):t},gdAccount:function(){var t=null;if(this.buyInfo.gdAccount){var o=.01*this.buyInfo.project.OriginalLowVote,e=this.buyInfo.gdAccount.AvailableBalance;return t=e<o?e:o}return t},gdAccountS:function(){var t=0;return this.gdAccount&&this.gdCh&&(t=this.gdAccount.toFixed(2)),t},coupon:function(){for(var t={},o=0;o<this.buyInfo.CouponList.length;o++)if(this.buyInfo.CouponList[o].CouponID==this.selected)return t=this.buyInfo.CouponList[o];return t}},mounted:function(){this.proId=window.location.search.split("id=")[1]||0,0==this.proId&&(window.location.href="../project/index.html"),this.buyInfo.project?console.log("预约项目"):console.log("普通项目"),this.getBuyInfo()}});