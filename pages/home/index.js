// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorys: [
      { id: 1, name: '分类1', img: '', price: 19.0},
      { id: 2, name: '分类1', img: '', price: 19.0},
      { id: 3, name: '分类1', img: '', price: 19.0},
      { id: 4, name: '分类1', img: '', price: 19.0},
      { id: 5, name: '分类1', img: '', price: 19.0},
      { id: 6, name: '分类1', img: '', price: 19.0}
    ],
    goods: [
      { id: 1, name: '商品1', img: '', price: 19.0},
      { id: 2, name: '商品2', img: '', price: 19.0},
      { id: 3, name: '商品3', img: '', price: 19.0},
      { id: 4, name: '商品4', img: '', price: 19.0},
      { id: 5, name: '商品5', img: '', price: 19.0},
      { id: 6, name: '商品6', img: '', price: 19.0}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPageScroll: function (e) {
    console.log(e)
  }
})