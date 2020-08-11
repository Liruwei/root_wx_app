// pages/order/index.js
import { GET } from '../../utils/network.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    orderType: 0, // 0: 未支付， 进行中， 已完成
    orders: [],
  },
  _page: 0,
  _loading: false,
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
    let status = app.globalData.status;
    let that = this;
    if (status != 0) {
      if (status != 3) {
        that.loadFirstPage();
      }
    } else {
      let time = setInterval(() => {
        status = app.globalData.status;
        if (status != 0) {
          that.loadFirstPage();
          clearTimeout(time);
        }
      }, 500);
    }
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
    this.loadFirstPage();
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

  onOrderTap: function({ currentTarget: { dataset: { id }} }) {
    wx.navigateTo({
      url: '/pages/order/detail?id=' + id,
    })
  },

  onOrderTypeTap: function({ currentTarget: { dataset : { value }} }) {
    this.setData({
       orderType: value
    });
    this.loadFirstPage()
  },

  toAuthorityTap: function() {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },

  loadFirstPage: function() {
    this._page = 0;
    this.loadData();
  },

  loadNextPag: function() {
    this._page +=  1;
    this.loadData();
  },

  loadData: function() {
    let that = this;
    wx.showLoading({ title: '加载中' });
    GET('/v1/shop/orders', {
      range: [this._page, 20],
      filter: {
        user_id: app.globalData.accountInfo.id,
        status: this.data.orderType
      }
    }, result => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      let orders = [...that.data.orderType];
      if (that._page == 0) { orders = []; }
      (result || []).forEach( o => {
        const items = JSON.parse(o.goods_numbers);
        let itemsCount = 0, time = o.create_time;
        let status = '';
        if (o.status == 0) {
          status = '未付款';
        } else if (o.status == 1) {
          status = '进行中'
        } else {
          status = '已完成'
        }
        items.forEach( x => {
          itemsCount += x.num;
        });
        orders.push({
          goodsInfo: items[0],
          count: itemsCount,
          amount: o.amount,
          status: status,
          id: o.id,
          time: (new Date(time * 1)).toLocaleString()
        })
      });
      that.setData({ orders: orders });
    }, error => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  }

})