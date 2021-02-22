// pages/order/index.js
import API from '../../api'
import TOOL from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    totals: [0,0,0,0,0,0],
    master: false,
    typeIndex: 1,
    loadingNext: false
  },
  loading: false,
  hasMore: true,
  page: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { master = '0', index = '0'} = options
    this.setData({ 
      master: master === '1',
      typeIndex: index * 1
    })
    wx.setNavigationBarTitle({
      title: master === '1' ? '订单管理' : '我的订单',
    })
    this.loadFiestPage(true)
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
    this.loadNextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onOrderDetailTap: function({ currentTarget: { dataset: { id}}}) {
    let that = this
    wx.navigateTo({
      url: `/pages/order/detail?order_id=${id}&master=${this.data.master}`,
      events: {
        reloadData: function() {
          that.loadFiestPage()
        }
      }
    })
  },

  onCancelOrderTap: function () {

  },

  loadFiestPage: function(showLoading) {
    if (this.loading) return
    wx.stopPullDownRefresh({})
    this.hasMore = true
    this.page = 1
    this.loadData(showLoading)    
  },

  loadNextPage: function() {
    if (this.loading || !this.hasMore) return
    this.page += 1
    this.loadData()
  },

  loadData: function(showLoading) {
    let that = this
    this.loading = true
    const {userInfo, projectInfo} = getApp().globalData
    let { master, typeIndex, orders} = this.data
    let filter = {}
    if (master) {
      filter.status = [1,3,1][typeIndex]
      filter.order_type = [1,1,0][typeIndex]
    } else {
      filter.status = [0, 1, 3, 1, 2][typeIndex]
      filter.order_type = [undefined, 1, 1, 0, undefined][typeIndex]
      filter.user_id = userInfo.id
    }
    showLoading && wx.showLoading({ title: '请求中'})
    this.page != 1 && this.setData({ loadingNext: true})
    API.ORDER_LIST(this.page, projectInfo.id, filter).then(res => {
      showLoading && wx.hideLoading()
      that.loading = false
      let tmp = that.page === 1 ? [] : [...orders]
      tmp = [...tmp, ...(res.data.map(o => TOOL.formatOrderInfo(o)))]
      that.setData({
        totals: [
          res.unpaytotal, 
          res.unsendtotal, 
          res.unreceivetotal, 
          res.instoretotal, 
          res.finishtotal, 
          res.unpaytotal + res.unsendtotal + res.unreceivetotal + res.instoretotal + res.finishtotal
        ],
        orders: tmp,
        loadingNext: false
      })
      that.hasMore = tmp.length < res.total
    }).catch(err => {
      showLoading && wx.hideLoading()
      that.loading = false
      wx.showToast({
        title: err,
        icon: 'none'
      })
      that.setData({
        loadingNext: false
      })
    })    
  },

  onTypeTap: function ({ currentTarget: { dataset : {index}}}) {
    this.setData({  typeIndex: index })
    this.loadFiestPage(true)
  }
})