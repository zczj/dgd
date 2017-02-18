var popupModel = new Vue({
  el: '#popup',
  data: {
    popup: false
  },
  methods: {
    showPopup: function() {
      if (!DGDTOOLS.checkLogin()) {
        DGDTOOLS.check._isLogin();
        return false;
      } else {
        this.popup = true;
      }
    },
    //  发送私信
    sendMsg: function() {
      var msg = this.$refs.msgBox;

      if (msg.value == '') {
        DGDTOOLS.tip._tip('请填写私信内容', function() {
          msg.focus()
        });
        return false;
      } else {
        // 发送请求
        $.ajax()
      }
    },
    // 动画结束后调用
    afterEnter: function() {
      this.$refs.msgBox.focus();
    }
  }
})