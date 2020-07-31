// pages/goods/index.js
import { GET } from '../../utils/network';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarHeight: app.globalData.navigationBarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    goodsInfo: null,
    num: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '加载中' });
    this.loadData(options.id);
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

  onCloseTap: function() {
    wx.navigateBack();
  },

  loadData: function(goods_id) {
    const that = this;
    GET(`/v1/shop/goods/${goods_id}`, {}, result => {
      wx.hideLoading();
      that.setData({ goodsInfo : result });
    }, error => {
      wx.showToast({ title: error, icon: 'none' });
    });
  },

  onAddTap: function() {
    this.setData({
      num: this.data.num + 1
    });
  },

  onDelTap: function() {
    this.setData({
      num: Math.max(1, this.data.num - 1)
    });
  },

  onAddToCart: function() {
    app.addGoodsInCart(this.data.goodsInfo.id, this.data.num);
  }
})