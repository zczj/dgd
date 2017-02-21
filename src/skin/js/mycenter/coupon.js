var couponModel = new Vue({
  el: '#coupon',
  data: {
    couponType: 1, // 1: 众筹之家优惠券, 2: 合作伙伴优惠券
    couponState: 1, // 优惠券状态
    couponList: [], // 优惠券列表
    partnerCouponList: [], // 合作伙伴优惠券列表
    //- isFirst: [,true,true, true],
    isPartnerFisrt: true,
  },
  methods: {
    // 众筹之家优惠券和合作伙伴优惠券切换
    toggleCoupon: function(id) {
      this.couponType = id;
      if (id == 2) {
        this.getPartnerCouponList();
      }
    },
    // 优惠券筛选
    getCouponFilter: function(id) {
      if (this.couponState == id) return;

      this.couponState = id;
      this.getCouponList();
    },
    // 获取优惠券
    getCouponList: function() {
      var _this = this,
        url = headerModel.api + '/MyCenter/CouponList';
      //- if(!this.isFirst[_this.couponState]) return;
      //- this.isFirst[_this.couponState] = false;
      headerModel.loading = true;
      $.ajax({
        url: url,
        data: {
          "state": _this.couponState,
          "currentpage": 1,
          "pagesize": 110,
          "token": "48fc788c24093a74ec88ea64ad85064d"
        },
        type: 'POST',
        success: function(res) {
          if (res.resultid) {
            _this.couponList = res.response;
            headerModel.loading = false;
          }
        }
      })
    },
    // 获取合作伙伴优惠券
    getPartnerCouponList: function() {
      var url = headerModel.api + '/MyCenter/ParterList';

      if (!this.isPartnerFisrt) return false;
      headerModel.loading = true;
      this.$http.get(url).then(function(res) {
        if (res.data.resultid == 200) {
          this.partnerCouponList = res.data.response;
          this.isPartnerFisrt = false;
          headerModel.loading = false;
        }
      })
    }
  },
  mounted: function() {
    this.getCouponList();
  }
})