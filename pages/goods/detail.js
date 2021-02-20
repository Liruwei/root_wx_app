// pages/goods/detail.js
import API from '../../api'
import TOOL from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: null,
    num: 1,
    cartNum: 0,
    imagePercent: 0,
    addViewShow: false,
    addViewShowContent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    API.GOODS_INFO(id).then(res => {
      wx.hideLoading({})
      that.setData({
        goods: TOOL.formatGoodsInfo(res.data, true)
      })
      console.log(res)
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
    wx.setNavigationBarTitle({
      title: '商品详情',
    })
    getApp().getCurrentCartInfo(res => {
      let cartNum = 0;
      res.forEach( obj => {
        cartNum += obj.num
      })
      that.setData({
        cartNum: cartNum
      })
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

  onAddToCart: function () {
    if (this.data.goods.stock <= 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      return
    }
    let that = this
    if (!this.data.addViewShow) {
      this.onShowAddView()
    } else {
      getApp().addToCart(this.data.goods, this.data.num, () => {
        wx.showToast({
          title: '加购成功',
        })
        that.onCloseAddView()
        that.setData({ num: 1})
        getApp().getCurrentCartInfo(res => {
          let cartNum = 0;
          res.forEach( obj => {
            cartNum += obj.num
          })
          that.setData({
            cartNum: cartNum
          })
        })    
      })
    }
  },

  onBuyNow: function() {
    if (this.data.goods.stock <= 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      return
    }
    let that = this
    if (!this.data.addViewShow) {
      this.onShowAddView()
    } else {
      that.setData({ num: 1})
    }
  },

  onCartTap: function () {
    wx.reLaunch({
      url: '/pages/cart/index',
    })
  },

  onDelTap: function () {
    this.setData({
      num: Math.max(1, this.data.num - 1)
    })
  },

  onAddTap: function () {
    this.setData({
      num: Math.min(this.data.goods.stock, this.data.num + 1)
    })
  }
})