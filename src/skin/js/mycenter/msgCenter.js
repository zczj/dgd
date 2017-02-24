var msgModel = new Vue({
  el: '#msg-center',
  data: {
    pageSize: 1, // 每页显示条数
    curPage: 1, // 当前页
    Pagedata: '',
    list: '',
  },
  computed: {
    /**
     * 返回评论列表
     */
    comList: function () {
      var comN = [], // 
        comS = [],
        comL = this.list ? this.list : [];
      for (var i = 0; i < comL.length; i++) {
        // 1.1 父级评论
        if (comL[i].ParentID == 0) {
          comL[i].comSon = [];
          comN.push(comL[i]);
        } else {
          // 1.2 二级评论
          comS.push(comL[i]);
        }
      }

      for (var j = 0; j < comN.length; j++) {
        for (var i = 0; i < comS.length; i++) {
          if (comS[i].ParentID == comN[j].ID) {
            comN[j].comSon.push(comS[i]);
          }
        }
      }

      return comN;
    },
    // 分页数组
    PagesIndex: function () {
      return DGDTOOLS.Ev._setPage(this.totalPage, this.curPage);
    },
    // 总页数
    totalPage: function () {
      return this.Pagedata.pagecount
      // return 15;
    }
  },
  methods: {
    // 获取消息列表
    /**
     * t1 : loding 方式
     * t2 : pc || mobile 
     * t3 : 回复追加数据
     * id : 回复对应的id
     */
    getMsgList: function (t1, t2, t3, id) {
      var _this = this;
      t1 ? headerModel.loading = true : $("#loader").fadeIn(300);
      $.ajax({
        url: headerModel.api + '/MyCenter/MyCenter_DelMessage',
        data: {
          "Token": headerModel.token,
          "MonthNum": 0,
          "currentpage": _this.curPage,
          "pagesize": _this.pageSize
        },
        type: 'post',
        success: function (response) {
          t1 ? headerModel.loading = false : $("#loader").fadeOut(300)
          if (response.resultid === 200) {
            _this.Pagedata = response;
            if (t2) {
              if (t3) {
                // unshift
                _this.list.pop({
                  'Account': mySideModel.userBaseInfo.UserName,
                  'Avatar': mySideModel.userBaseInfo.Avatar,
                  'UserID': mySideModel.userBaseInfo.uid,
                  'PostDate': '刚刚',
                  'Content': _this.comTxt,
                  'ParentID': id,

                })
              } else {
                _this.list = _this.list.concat(response.RelpyList)

              }

            } else {
              _this.list = response.RelpyList;
            }
          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          t1 ? headerModel.loading = false : $("#loader").fadeOut(300)
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    // 显示二级评论框
    toggleRepay: function (id, e) {
      var _this = this;
      var appendDiv = $(e.target).parents('.com-cont'),
        subForm = '<div class="com-form"><div class="com-inner"><textarea placeholder="来说两句吧……" value="" class="com-box"></textarea></div> <div class="com-ft clearfix"><!----> <button data-color="#fff">发表评论</button></div></div>';
      if (appendDiv.find('.com-form').length) {
        appendDiv.find('.com-form').toggle();
        return;
      } else {
        appendDiv.append(subForm);
      }
      appendDiv.find('button').click(function () {

        _this.comTxt = appendDiv.find('textarea').val();
        _this.postComment(id, appendDiv.find('textarea'));
      })
    },
    checkComment: function (obj) {
      var _this = this;
      if (!headerModel.isLogin) {
        DGDTOOLS.check._isLogin();
        return false;
      }
      if (obj.val() == '') {
        DGDTOOLS.tip._tip('请说两句。。。', function () {
          obj.focus();
        })
        return false;
      }
      return true;
    },
    // 提交评论信息
    postComment: function (id, obj) {
      var _this = this;
      var pId = id ? id : 0;
      obj = obj ? obj : $(_this.$refs.comTxt);
      _this.comTxt = obj.val();
      // 1.1 检测登录
      if (!_this.checkComment(obj)) {
        return
      }
      // newsid = 7431
      headerModel.loading = true;
      $.ajax({
        url: headerModel.api + '/MyCenter/ReplyMessage',
        data: {
          "token": headerModel.token,
          "Content": _this.comTxt,
          "MessageID": pId,
        },
        type: 'post',
        success: function (response) {
          headerModel.loading = false;
          if (response.resultid == 200) {
            // 提交评论成功 拼接到二级评论前面。
            obj.val('');
            if (headerModel.isMobileOrTable) {
              _this.getMsgList(1, 'mb', 'oppend', pId)
            } else {
              _this.getMsgList();

            }

          } else {
            DGDTOOLS.tip._tip(response.message)
          }
        },
        error: function (e) {
          headerModel.loading = false;
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    },
    /* 翻页事件 */
    pageClick: function (index, type) {
      if (index != this.curPage) {
        this.curPage = index;
        type ? this.getMsgList(1, 'mb') : this.getMsgList(1);
      }
    },
    // 删除指定的站内信
    delMsg: function (id, e) {
      var _this = this;
      console.log(id)
      headerModel.loading = true;
      $.ajax({
        url: headerModel.api + '/MyCenter/DelMessage',
        data: {
          "Token": headerModel.token,
          "MsgID": id
        },
        type: 'post',
        success: function (response) {
          headerModel.loading = false
          if (response.resultid === 200) {
            DGDTOOLS.tip._tipAll({
              type: 'ok',
            })

          } else {
            DGDTOOLS.tip._tip(response.message);
          }
        },
        error: function (e) {
          headerModel.loading = false
          DGDTOOLS.tip._tip(e.status + ":" + '接口异常')
          console.error(e.status + ":" + e.responseText);
        }
      })
    }
  },
  mounted: function () {
    this.getMsgList();
  }
})