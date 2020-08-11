// pages/order/detail.js

import { GET } from '../../utils/network';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    goods: [],
    count: 0,
    reduce: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  loadData: function(orderid) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    GET('/v1/shop/orders/' + orderid, {
    }, result => {
      let info = result, count = 0, totalPrice = 0;      
      let goods = JSON.parse(info.goods_numbers);
      delete info.goods_numbers;
      info.create_time = (new Date(info.create_time * 1)).toLocaleString()
      if (info.status == 0) {
        wx.setNavigationBarTitle({ title: '待支付' });
      } else if (info.status == 1) {
        wx.setNavigationBarTitle({ title: '进行中' });
      } else {
        wx.setNavigationBarTitle({ title: '已完成' });
      }
      goods.forEach( x => {
        count += x.num;
        totalPrice += x.price;
      });
      that.setData({ info: info, goods: goods, count: count, reduce: totalPrice - info.amount});
      wx.hideLoading();
    }, error => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  onPayTap: function() {
    wx.showToast({
      title: '暂未开放',
      icon: 'none'
    })
  }
})