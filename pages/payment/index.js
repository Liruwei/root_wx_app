// pages/payment/index.js
const app = getApp();
import { POST } from '../../utils/network';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: app.globalData.paymentInfo.list || [],
    total: app.globalData.paymentInfo.total || 0,
    oldTotal: app.globalData.paymentInfo.oldTotal || 0,
    totalPrice: 0,
    totalReduce: 0,
    // coupon: {
    //   title: '全场优惠',
    //   price: 15
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let totalPrice = app.globalData.paymentInfo.total;
    let totalReduce = app.globalData.paymentInfo.oldTotal > app.globalData.paymentInfo.total ?
      (app.globalData.paymentInfo.oldTotal - app.globalData.paymentInfo.total) : 0;
    if (this.data.coupon) {
      totalPrice -= this.data.coupon.price;
      totalReduce += this.data.coupon.price;
    } else {
      totalPrice = totalPrice * 1.0;
      totalReduce = totalReduce * 1.0;
    }
    this.setData({
      list: app.globalData.paymentInfo.list || [],
      total: app.globalData.paymentInfo.total || 0,
      oldTotal: app.globalData.paymentInfo.oldTotal || 0,
      totalPrice: totalPrice.toFixed(1),
      totalReduce: totalReduce.toFixed(1)
    });

    console.log(this.data.list)
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

  onPay: function () {
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['hMuSZePpSdryiyPHWdO74mbqjm54IJLTG727L7F2sKc'],
      success: function (res) {
        that.payWithMoney();
      },
      fail: function (error) {
        that.payWithMoney();
      }
    })
  },

  payWithMoney: function () {
    let that = this;
    let items = [];
    this.data.list.forEach(x => {
      items.push({
        sid: x.sku_id ? x.sku_id : x.id,
        num: x.num
      });
    });

    if (app.globalData.paymentInfo.fromType == 'cart') {
      let goods = (wx.getStorageSync('cart_goods') || []).filter(o => {
        let need = true;
        this.data.list.forEach(goods => {
          if (goods.sku_id == o.id) need = false;
        });
        return need;
      });

      wx.showLoading({ title: '请稍等' });
      POST('/v1/wx/orders/create', {
        user_id: app.globalData.accountInfo.id,
        items: items
      }, result => {
        wx.setStorage({
          key: 'cart_goods',
          data: goods,
          complete: () => {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/payment/success',
            })
          }
        });
      }, error => {
        wx.hideLoading();
        wx.showToast({
          title: error,
          icon: 'none'
        })
      })
    } else {
      wx.showLoading({ title: '请稍等' });
      POST('/v1/wx/orders/create', {
        user_id: app.globalData.accountInfo.id,
        items: items
      }, result => {
        wx.hideLoading();
        wx.redirectTo({
          url: '/pages/payment/success',
        })
      }, error => {
        wx.hideLoading();
        wx.showToast({
          title: error,
          icon: 'none'
        })
      })
    }

  }
})