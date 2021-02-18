// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    bannerPercent: 1 / 3 * 100,
    categoryPercent: 0,
    banners: ['A', 'B', 'C'],
    categorys: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    goods: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
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
    let that = this
    this.setData({ loading: true })
    setTimeout(() => {
      that.setData({ loading: false })
    }, 2000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onSwiperChange: function ({ detail: { current } }) {
    this.setData({ bannerPercent: (current + 1) / (this.data.banners.length * 1.0) * 100 })
  },

  onScrollViewScroll: function ({ detail: { scrollLeft, scrollWidth } }) {
    this.setData({ categoryPercent: scrollLeft / scrollWidth * 100 })
  }
})