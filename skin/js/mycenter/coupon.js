var couponModel=new Vue({el:"#coupon",data:{couponType:1,couponState:1,couponList:[],partnerCouponList:[],isPartnerFisrt:!0},methods:{toggleCoupon:function(t){this.couponType=t,2==t&&this.getPartnerCouponList()},getCouponFilter:function(t){this.couponState!=t&&(this.couponState=t,this.getCouponList())},getCouponList:function(){var t=this,e=headerModel.api+"/MyCenter/CouponList";headerModel.loading=!0,$.ajax({url:e,data:{state:t.couponState,currentpage:1,pagesize:110,token:"48fc788c24093a74ec88ea64ad85064d"},type:"POST",success:function(e){e.resultid&&(t.couponList=e.response,headerModel.loading=!1)}})},getPartnerCouponList:function(){var t=headerModel.api+"/MyCenter/ParterList";return!!this.isPartnerFisrt&&(headerModel.loading=!0,void this.$http.get(t).then(function(t){200==t.data.resultid&&(this.partnerCouponList=t.data.response,this.isPartnerFisrt=!1,headerModel.loading=!1)}))}},mounted:function(){this.getCouponList()}});