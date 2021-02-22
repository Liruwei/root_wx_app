// pages/cart/result.js
import API from '../../api'
import TOOL from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: -1,
    order: undefined
  },
  timer: null,
  order_id: null,
  loading: false,
  fromDetail: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ order_id, status, fromDetail }) {
    let that = this
    this.order_id = order_id
    this.fromDetail = fromDetail === '1'
    this.setData({ pageType: status * 1 })
    if (status * 1 === 0) {
      wx.setNavigationBarTitle({ title: '支付失败' })
      this.loadData(true)
    } else {
      wx.setNavigationBarTitle({ title: '查询中' })  
      that.timer = setInterval(() => {
        that.loadData(false, res => {
          if (res.status > 0) {
            wx.setNavigationBarTitle({ title: '支付成功' })  
            clearInterval(that.timer)
          }
        })
      }, 1000);
    }
  },

  loadData(loading = true, cb) {
    loading && wx.showLoading({ title: '请求中' })
    let that = this
    if (that.loading) return
    this.loading = true
    API.ORDER_CHECK(this.order_id).then(({ data }) => {
      that.loading = false
      loading && wx.hideLoading({})
      let tmp = TOOL.formatOrderInfo(data)
      that.setData({ order: tmp })
      cb && cb(tmp)
    }).catch(err => {
      that.loading = false
      loading && wx.hideLoading({})
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/home/index',
        })
      }, 2000);
    })
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
    clearInterval(this.timer)
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

  toOrderTap: function () {
    if (this.fromDetail) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: `/pages/order/detail?order_id=${this.data.order.id}`,
      })  
    }
  },

  toHomeTap: function () {
    wx.reLaunch({
      url: '/pages/home/index',
    })
  }
})