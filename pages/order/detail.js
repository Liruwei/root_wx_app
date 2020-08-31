// pages/order/detail.js
const app = getApp();
import { GET, POST, PUT } from '../../utils/network';

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
  _ID: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._ID = options.id;
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
    this.loadData(this._ID);
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
  loadData: function (orderid) {
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
      if (info.end_time * 1 > 0) {
        info.end_time = (new Date(info.end_time * 1)).toLocaleString()
      }
      if (info.pay_time * 1 > 0) {
        info.pay_time = (new Date(info.pay_time * 1)).toLocaleString()
      }
      if (info.after_time * 1 > 0) {
        info.after_time = (new Date(info.after_time * 1)).toLocaleString()
      }
      console.log(info)
      if (info.status == 0) {
        wx.setNavigationBarTitle({ title: '待支付' });
      } else if (info.status == 1 || info.status == 2) {
        wx.setNavigationBarTitle({ title: '进行中' });
      } else if (info.status == 3) {
        wx.setNavigationBarTitle({ title: '退款中' });
      } else {
        wx.setNavigationBarTitle({ title: '已完成' });
      }
      goods.forEach(x => {
        count += x.num;
        totalPrice += x.price;
      });
      that.setData({ info: info, goods: goods, count: count, reduce: totalPrice - info.amount });
      wx.hideLoading();
    }, error => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  onPayTap: function () {
    let that = this;
    wx.showLoading({ title: '请稍等', mask: true });
    POST('/v1/wx/orders/payinfo', {
      user_id: app.globalData.accountInfo.id,
      order_id: this.data.info.order_id
    }, ({ data: { pay_info, order_id } }) => {
      that.payWithInfo(order_id, pay_info);
    }, error => {
      wx.hideLoading();
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
  },
  payWithInfo: function (order_id, pay_info, cb) {
    wx.requestPayment({
      ...pay_info,
      success(res) {
        wx.hideLoading();
        cb && cb();
        wx.navigateTo({
          url: '/pages/payment/success?order_id=' + order_id,
        })
      },
      fail(res) {
        wx.hideLoading();
        cb && cb();
        wx.navigateTo({
          url: '/pages/payment/success?order_id=' + order_id,
        })
      }
    })
  },
  onFinishTap: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否完成订单？',
      cancelText: '取消',
      confirmText: '完成订单',
      complete: ({ confirm }) => {
        if (confirm) {
          wx.showLoading({
            title: '请求中',
            mask: true
          })
          PUT(`/v1/shop/orders/${that.data.info.id}`, {
            status: 4
          }, res => {
            wx.hideLoading();
            that.loadData(that._ID)
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
  },
  onReturnTap: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否申请退款？',
      cancelText: '取消',
      confirmText: '申请',
      complete: ({ confirm }) => {
        if (confirm) {
          wx.showLoading({
            title: '请求中',
            mask: true
          })
          PUT(`/v1/shop/orders/${that.data.info.id}`, {
            status: 3,
            after_time: (new Date()).getTime()
          }, res => {
            wx.hideLoading();
            wx.showToast({
              title: '申请售后成功',
              duration: 1500
            })
            setTimeout(() => {
              that.loadData(that._ID)  
            }, 1500);
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
  }
})