// pages/master/money.js
import API from '../../api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      money: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.setNavigationBarTitle({
        title: '余额',
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
      wx.showLoading({ title: '请求中'})
      let that = this
      getApp().loadProjectInfo(getApp().globalData.projectInfo.id, () =>{
        wx.hideLoading()
        that.setData({ money: (getApp().globalData.projectInfo.money / 100).toFixed(2)})
      });
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
    
    toGetMoneyTap: function () {
        wx.navigateTo({
          url: '/pages/master/getmoney',
        })
    }
})