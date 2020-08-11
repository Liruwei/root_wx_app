// pages/my/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navigationBarHeight: app.globalData.navigationBarHeight,
    status: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ status: app.globalData.status });
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
    this.setData({ status: app.globalData.status });
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

  toAuthorityTap: function() {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },

  onPointTap: function() {
    wx.showToast({
      title: '暂未开放',
      icon: 'none'
    })
  },

  onCouponTap: function() {
    wx.showToast({
      title: '暂未开放',
      icon: 'none'
    })
  }
})