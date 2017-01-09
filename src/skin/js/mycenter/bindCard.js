/**
 * 绑定银行卡
 */

var bindCardModel = new Vue({
  el: '#model-bindCard',
  data: {
    orderId:'',
    orderInfo:'',
    bankSelected: '0',
    authen:'',
    provinceS:'0',
    cityS:'',
    province:[],    
    // 银行信息
    bankListMap: [{
      'payCode':
      "0", 'bankName': "选择银行"
    },
    {
      'payCode':
      "ICBC", 'bankName': "中国工商银行"
    },
    {
      'payCode':
      "ABC", 'bankName': "中国农业银行"
    },
    {
      'payCode':
      "CCB", 'bankName': "中国建设银行"
    },
    {
      'payCode':
      "BOC", 'bankName': "中国银行"
    },
    {
      'payCode':
      "BCOM", 'bankName': "中国交通银行"
    },
    {
      'payCode':
      "CIB", 'bankName': "兴业银行"
    },
    {
      'payCode':
      "CITIC", 'bankName': "中信银行"
    },
    {
      'payCode':
      "CEB", 'bankName': "中国光大银行"
    },
    {
      'payCode':
      "PAB", 'bankName': "平安银行"
    },
    {
      'payCode':
      "PSBC", 'bankName': "中国邮政储蓄银行"
    },
    {
      'payCode':
      "SHB", 'bankName': "上海银行"
    },
    {
      'payCode':
      "SPDB", 'bankName': "浦发银行"
    },
    {
      'payCode':
      "CMBC", 'bankName': "中国民生银行"
    },
    {
      'payCode':
      "CMB", 'bankName': "招商银行"
    },
    {
      'payCode':
      "GDB", 'bankName': "广发银行"
    },
    {
      'payCode':
      "HXB", 'bankName': "华夏银行"
    }]
  },
  methods: {
    getOrderInfo: function  () {
      var _this = this;
      // 检测登录
      if (!headerModel.isLogin) {;
        DGDTOOLS.check._isLogin();
        return;
      } else{
        $('#loader').fadeIn(300);
        this.$http.get(headerModel.api + '/Order/GetOrder?orderid='+ this.orderId).then(function (response) {
          $('#loader').fadeOut(300);
          _this.orderInfo = response.data;
        })
      }
    },
    // 获取认证信息
    getAuthen: function () {
      $("#loader").fadeIn(300)
      this.$http.get(headerModel.api + '/Pay/QueryAuthenticator?token=' + headerModel.token).then(function (response) {
        $('#loader').fadeOut(300);
        this.authen = response.data
      })
    },
    // 城市二级联动
    getCity: function  (id) {
      var _this = this;
      headerModel.loading=true;
      _this.$http.get(headerModel.api + '/Help/GetCity?provinceid=' + id).then(function (response) {
        headerModel.loading=false;
        _this.province = response.data.cityList;
        console.log(response.data.cityList);
        // if(id=='0'){
        //   _this.provinced = response.data.cityList;
        //   console.log(_this.provinced);
        // }else{
        //   _this.city= response.data;
        // }
      })
    },
    getCitys: function  (id) {
      var _this = this
      $.ajax({
        url: headerModel.api + '/Help/GetCity?provinceid=' + id,
        type: 'get',
        async: false,
        success: function (response) {
          setTimeout(function  () {
            _this.province= response.cityList;
          },1000)
        },
        error: function (e) {
            console.error(e.status + ":" + e.responseText);
          }
      })
      
    }
  },
  computed: {
    provinced: function () {
      // 省份
     var province = [{
        "ID": 0,
        "CityID": '',
        "FatherID": '',
        "CityName": ""
      }];

      return province.concat(this.province);
        // 城市
        // city:[{
        //   "ID": 0,
        //   "CityID": '',
        //   "FatherID": '',
        //   "CityName": ""
        // }],
    },
    city: function  () {
      return '';
    }
  },
  mounted: function () {
    this.orderId = window.location.search.split('orderId=')[1] || 0;
    if (!this.orderId) {
      window.location.href="../project/index.html"
    }
    // 103775
    this.getOrderInfo()
    this.getAuthen()
  }
})