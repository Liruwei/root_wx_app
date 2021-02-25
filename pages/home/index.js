// pages/home/index.js
import API from '../../api'
import TOOL from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadMore: false,
    bannerPercent: 1,
    categoryPercent: 0,
    banners: [],
    categorys: [],
    goods: [],
    hasProject: false,
  },
  page: 1,
  loading: false,
  hasMore: true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: getApp().globalData.projectInfo.name || '店铺首页',
    })
    this.onPullDownRefresh()

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
    this.setData({
      hasProject: getApp().hasProject()
    }) 
    wx.hideHomeButton({
      success: (res) => {},
    })
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
    this.loadFiestPage()
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
    return {
      path: `/pages/index/index?project=${getApp().globalData.projectInfo.id}`
    }
  },

  onSwiperChange: function ({ detail: { current } }) {
    this.setData({ bannerPercent: (current + 1) / (this.data.banners.length * 1.0) * 100 })
  },

  onScrollViewScroll: function ({ detail: { scrollLeft, scrollWidth } }) {
    this.setData({ categoryPercent: scrollLeft / scrollWidth * 100 })
  },

  onCategoryTap: function ({ currentTarget: {dataset: { category }} }) {
    wx.navigateTo({
      url: '/pages/goods/category?id=' + category.id,
    })
  },

  onGoodsTap: function ({ currentTarget: { dataset: { item}}}) {
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + item.id,
    })
  },

  loadFiestPage: function() {
    if (this.loading) {
      wx.stopPullDownRefresh({})
      return
    }
    let that = this
    this.page = 1
    this.loading = true
    this.hasMore = true
    const projectInfo = getApp().globalData.projectInfo
    Promise.all([
      API.HOME_BANNERS(projectInfo.id), 
      API.HOME_CATEGORYS(projectInfo.id),
      API.HOME_GOODS(this.page, projectInfo.id)
    ]).then(([bannersRes, caregorysRes, goodsRes]) => {
      wx.stopPullDownRefresh()
      that.loading = false
      that.hasMore = goodsRes.total > goodsRes.data.length
      that.setData({
        banners: bannersRes.data || [],
        categorys: caregorysRes.data || [],
        goods: (goodsRes.data || []).map(o => TOOL.formatGoodsInfo(o)),
        bannerPercent: 1 / Math.max(1, bannersRes.data.length)
      })
    })
  },

  loadNextPage: function() {
    if (this.loading || !this.hasMore) return
    this.setData({ loadMore: true})
    let that = this
    this.page += 1
    this.loading = true
    const projectInfo = getApp().globalData.projectInfo
    API.HOME_GOODS(this.page, projectInfo.id).then(({ data = [] }) => {
      that.loading = false
      if (data.length == 0) {
        that.hasMore = false
      } 
      that.setData({
        goods: [...that.data.goods, ...data.map(o => o => TOOL.formatGoodsInfo(o))],
        loadMore: false
      })
    });
  },
  toMyProjectTap: function() {
    getApp().toMyProject()
  }
})