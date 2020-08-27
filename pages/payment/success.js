// pages/payment/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 10,
    status: 0, // 0: 未知  1: 支付成功  2: 支付失败
    progress: '0%'
  },
  _timer: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    this.setData({
      progress: '100%'
    })
    this._timer = setTimeout(() => {
        that.setData({
          status: 2,
        });
        wx.setNavigationBarTitle({
          title: '支付失败',
        });
        clearTimeout(that._timer);
        that._timer = null;
    }, 1000 * 5);
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
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
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

  }
})