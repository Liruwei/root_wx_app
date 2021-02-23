// pages/goods/category.js
import API from '../../api'
import TOOL from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    search: '',
    loadingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id }) {
    this.caregory_id = id
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
    this.loadFirstPage()
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

  onGoodsTap: function ({ currentTarget: { dataset: { item}}}) {
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + item.id,
    })
  },

  onInput: function({ detail: { value}}) {
    this.setData({ search: value})
  },

  onSearch: function() {
    this.loadFirstPage()
  },

  page: 1,
  loading: false,
  hasMore: true,
  loadFirstPage: function() {
    if (this.loading) return
    this.page = 1
    this.hasMore = true
    wx.showLoading({ title: '请求中'})
    this.loadData(() => {
      wx.hideLoading({})
    })
  },

  loadNextPage: function() {
    if (this.loading) return
    this.page += 1
    this.loadData()
    this.setData({ loadingMore: true})
  },

  loadData: function(cb) {
    let that = this
    this.loading = true
    let goods = this.page === 1 ? [] : [...this.data.goods]
    API.HOME_GOODS(this.page, getApp().globalData.projectInfo.id, {
      name: this.data.search,
      category: this.caregory_id
    }).then(({ data, total}) => {
      cb && cb()
      that.loading = false
      goods = [...goods, ...(data.map(o => TOOL.formatGoodsInfo(o)))]
      that.hasMore = goods.length < total
      that.setData({
        loadingMore: false,
        goods: goods
      })
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err,
        icon: 'none'
      })
      that.loading = false
      cb && cb()
      that.setData({
        loadingMore: false
      })

    })
  }
})