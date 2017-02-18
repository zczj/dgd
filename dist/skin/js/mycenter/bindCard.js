var bindCardModel=new Vue({el:"#model-bindCard",data:{orderId:"",orderInfo:"",bankSelected:"0",authen:"",provinceS:"0",cityS:"",province:"",city:"",backCode:"",masterBank:"",tel:"",showProvince:!1,showCity:!1,buyLock:!1,bankListMap:[{payCode:"0",bankName:"选择银行"},{payCode:"ICBC",bankName:"中国工商银行"},{payCode:"ABC",bankName:"中国农业银行"},{payCode:"CCB",bankName:"中国建设银行"},{payCode:"BOC",bankName:"中国银行"},{payCode:"BCOM",bankName:"中国交通银行"},{payCode:"CIB",bankName:"兴业银行"},{payCode:"CITIC",bankName:"中信银行"},{payCode:"CEB",bankName:"中国光大银行"},{payCode:"PAB",bankName:"平安银行"},{payCode:"PSBC",bankName:"中国邮政储蓄银行"},{payCode:"SHB",bankName:"上海银行"},{payCode:"SPDB",bankName:"浦发银行"},{payCode:"CMBC",bankName:"中国民生银行"},{payCode:"CMB",bankName:"招商银行"},{payCode:"GDB",bankName:"广发银行"},{payCode:"HXB",bankName:"华夏银行"}]},methods:{getOrderInfo:function(){var e=this;return headerModel.isLogin?($("#loader").fadeIn(300),void this.$http.get(headerModel.api+"/Order/GetOrder?orderid="+this.orderId).then(function(t){$("#loader").fadeOut(300),e.orderInfo=t.data})):void DGDTOOLS.check._isLogin()},getAuthen:function(){$("#loader").fadeIn(300),this.$http.get(headerModel.api+"/Pay/QueryAuthenticator?token="+headerModel.token).then(function(e){$("#loader").fadeOut(300),this.authen=e.data})},getCity:function(e){var t=this;0!=e&&(headerModel.loading=!0),t.$http.get(headerModel.api+"/Help/GetCity?provinceid="+e).then(function(a){headerModel.loading=!1,t.showProvince=!0,0!=e?(t.city=a.data.cityList,t.cityS="0"):t.province=a.data.cityList})},getCityStr:function(){var e=this,t="";if(e.provinceS&&e.cityS){for(var a=0;a<e.province.length;a++)if(e.province[a].CityID===e.provinceS){t+=e.province[a].CityName+",";break}for(var a=0;a<e.city.length;a++)if(e.city[a].CityID===e.cityS){t+=e.city[a].CityName;break}}return t},bindCh:function(){var e=this;return"0"==e.bankSelected?(DGDTOOLS.tip._tip("请选择开户银行卡"),!1):""==e.backCode?(DGDTOOLS.tip._tip("请输入银行卡号",function(){e.$refs.backCode.focus()}),!1):isNaN(e.backCode)||e.backCode.length<16?(DGDTOOLS.tip._tip("银行卡号输入不合法",function(){e.$refs.backCode.focus()}),!1):e.provinceS&&e.cityS?""!=e.masterBank||(DGDTOOLS.tip._tip("请输入支行名称",function(){e.$refs.masterBank.focus()}),!1):(DGDTOOLS.tip._tip("请选择银行卡开户省市"),!1)},bindFn:function(){var e=this;if(e.bindCh())return""==e.tel?void DGDTOOLS.tip._tip("请输入银行卡预留手机号",function(){e.$refs.tel.focus()}):DGDTOOLS.check._isPhone(e.tel)?void $.dialog({type:"warning",message:"使用该卡进行支付后会自动绑定该卡作为以后充值、支付、提现的唯一卡",buttons:[{text:"确认",type:"green",callback:function(){e.buyLock||(e.buyLock=!0,$.ajax({url:headerModel.api+"/Pay/Deal",data:{PayCode:e.bankListMap[e.bankSelected].payCode,AccNo:e.backCode,IdHolder:e.authen.FullName,IdCard:e.authen.IDNumber,Mobile:e.tel,TxnAmt:e.orderInfo.order.PayAmount.toFixed(2),TradeNo:e.orderId,Token:headerModel.token,City:e.provinceS+","+e.cityS,BankName:e.bankListMap[e.bankSelected].bankName,BranchName:e.masterBank},type:"post",success:function(e){"0000"==e.retCode?DGDTOOLS.tip._tip("银行卡绑定成功",function(){}):DGDTOOLS.tip._tip(e.retMsg)},error:function(e){DGDTOOLS.tip._tip(e.status+":接口异常"),console.error(e.status+":"+e.responseText)}}))}},{text:"取消",type:"red"}],maskClose:!0,effect:!0}):void DGDTOOLS.tip._tip("预留手机号不合法！",function(){e.$refs.tel.focus()})}},computed:{sheng:function(){this.$nextTick(function(){return this.province})},isMC:function(){return 0==this.orderId}},mounted:function(){this.orderId=window.location.search.split("orderId=")[1]||0,this.getOrderInfo(),this.getAuthen(),this.getCity(0)}});