// pages/index/index.js
import { PUT } from '../../utils/network';

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

  onGetUserInfo: function({ detail: { userInfo }}) {
    const app = getApp();
    const {
      avatarUrl,
      nickName,
      gender
    } = userInfo;
    app.globalData.userInfo = userInfo;
    
    wx.showLoading({ title: '请稍等' });
    PUT('/v1/users/' + app.globalData.accountInfo.id, {
      avatar: avatarUrl,
      name: nickName,
      gender: gender
    }, result => {
      app.handleStatus(() => {
        wx.hideLoading();
        wx.navigateBack();
      });  
    }, error => {
      wx.showToast({ title: error, icon: 'none' });
    });
  },

  login: function() {
    
  }
})