// pages/goods/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [{}, {}, {}, {}, {}, {}],
    imagePercent: 0,
    addViewShow: false,
    addViewShowContent: false
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

  onSwiperChange: function ({ detail: { current } }) {
    this.setData({ imagePercent: (current + 1) / (this.data.photos.length * 1.0) * 100 })
  },

  onCloseAddView: function () {
    if (this.addViewAnimating || !this.data.addViewShowContent) return;
    this.addViewAnimating = true;
    let that = this;
    that.setData({ addViewShowContent: false })
    setTimeout(() => {
      that.setData({ addViewShow: false })  
    }, 300);
    setTimeout(() => {
      delete that.addViewAnimating
    }, 500);
  },

  onShowAddView: function () {
    if (this.addViewAnimating || this.data.addViewShow) return;
    this.addViewAnimating = true;
    this.setData({ addViewShow: true })
    this.setData({ addViewShowContent: true })
    let that = this;
    setTimeout(() => {
      delete that.addViewAnimating
    }, 500);
  },

  onAddViewContentTap: function () { },

  onCartTap: function () {
    wx.reLaunch({
      url: '/pages/cart/index',
    })
  }
})