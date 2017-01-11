/**
 * 评论js
 */
var datas =[{
  comId:'001',
  author:'laosu',
  time:'2016-07-08',
  txt:'写的有点意思，好文章，值得收藏!',
  listCom:[{ // 二级评论
    comId:'0010'
  }]
}];
var commentModel = new Vue({
  el: '#comment',
  data: datas,
  methods: {
    // 提交评论
    comSbmit: function  () {
      
    }
  }
})