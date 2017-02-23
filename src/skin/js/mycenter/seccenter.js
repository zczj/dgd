//- 
var seccenterModel = new Vue({
  el: '#seccenter',
  data: {
    popup: 1,
    email: false, // 修改邮箱
    provinceS: '0', // 选中的省份
    cityS: '', // 选中的城市
    province: '',
    city: '',
    verified: false, //认证展开层
    // 认证展开层下拉列表框
    verifiedProvinceS: '0',
    verifiedCityS: '',
    verifiedProvince: '',
    verifiedCity: '',
    detailUserInfo: false, // 详细信息

    tabID: 3, // 选项卡

    // 安全设置
    loginPwd: false,
    payPwd: false,
  },
  methods: {
    // tab切换
    switchTab: function(tabID) {
      this.tabID = tabID;
    },
    // 城市二级联动
    getCity: function(id) {
      var _this = this;
      if (id != 0) {
        headerModel.loading = true;
      }
      _this.$http.get(headerModel.api + '/Help/GetCity?provinceid=' + id).then(function(response) {
        headerModel.loading = false;
        _this.showProvince = true;
        if (id != 0) {
          _this.city = _this.verifiedCity = response.data.cityList;
          _this.cityS = _this.verifiedCityS = '0';
        } else {
          _this.province = _this.verifiedProvince = response.data.cityList;

        }

      })
    },
    getCityStr: function() {
      var _this = this,
        str = '';
      if (_this.provinceS && _this.cityS) {
        for (var i = 0; i < _this.province.length; i++) {
          if (_this.province[i].CityID === _this.provinceS) {
            str += _this.province[i].CityName + ',';
            break;
          }
        }
        for (var i = 0; i < _this.city.length; i++) {
          if (_this.city[i].CityID === _this.cityS) {
            str += _this.city[i].CityName;
            break;
          }
        }
      }
      return str;
    },
    // 实名认证
    investorAuthenticate: function() {
      var _this = this,
        url = headerModel.api + '/MyCenter/Investor';
      headerModel.loading = true;
      $.ajax({
        url: url,
        data: {
          "token": headerModel.token,
          "fullname": _this.$refs.verifiedUserName.value || '',
          "area": _this.$refs.verifiedArea.value || '',
          "idnumber": _this.$refs.verifiedIDnumber.value || '',
          "provinceid": _this.$refs.verifiedProvinceid.value || '',
          "cityid": _this.$refs.verifiedCityid && _this.$refs.verifiedCityid.value || '',
          "pimg": "0",
          "nimg": "0"
        },
        type: 'POST',
        success: function(res) {
          headerModel.loading = false;
          if (res.resultid == 200) {
            DGDTOOLS.tip._tip('证件已提交，请等待审核!');
            _this.verified = false;
          } else {
            DGDTOOLS.tip._tip(res.message);
          }
        }
      })
    },
    // 设置登录密码
    setLoginPwd: function() {
      var _this = this,
        url = headerModel.api + '/Passport/ResetLoginPassword';
      headerModel.loading = true;
      $.ajax({
        url: url,
        data: {
          "token": headerModel.token,
          "OldPwd": _this.$refs.oldPwd.value,
          "NewPwd": _this.$refs.newPwd.value
        },
        type: 'POST',
        success: function(res) {
          headerModel.loading = false;
          if (res.resultid == 200) {
            DGDTOOLS.tip._tip('密码修改成功!');
            _this.loginPwd = false;
          } else {
            DGDTOOLS.tip._tip(res.message);
          }
        }
      })
    }
  },
  mounted: function() {

    // 日历选择
    flatpickr(".flatpickr", {
      "locale": "zh"
    });
    //- 省市联动
    this.getCity(0);


  }
})