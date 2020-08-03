// pages/payment/index.js
const app = getApp();
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

  onPay: function() {
    if (app.globalData.paymentInfo.fromType == 'cart') {
      let that = this;
      let goods = (wx.getStorageSync('cart_goods') || []).filter( o => {
        let need = true;
        this.data.list.forEach(goods => {
          if (goods.id == o.id) need = false;
        });
        return need;
      });
      wx.showLoading({ title: '请稍等' });
      wx.setStorage({
        key: 'cart_goods',
        data: goods,
        complete: () => {
          setTimeout(() => {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/payment/success',
            })
          }, 200);
        }
      });  
    } else {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/payment/success',
        })  
      }, 2000);

    }  
  }
})