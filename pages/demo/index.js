// pages/demo/index.js
import { POST } from '../../utils/network';
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let openid = app.globalData.accountInfo.openid
        POST('/wx/createpay', { 'openid' : openid }, result => {
            console.log(result)
            wx.requestPayment({
              nonceStr: result.data.nonceStr,
              package: result.data.package,
              paySign: result.data.paySign,
              timeStamp: result.data.timeStamp,
              signType: result.data.signType,
              success: function(res) { 
                console.log(res)
              },
              fail:function(res) { 
                console.log(res)
            }
            })
          }, error => {
            console.log(error);
          });
    }
})