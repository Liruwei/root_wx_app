// pages/enter/index.js
import API from '../../api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      isMaster: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '入驻',
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
      this.setData({
        isMaster: getApp().isMaster()
      })
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
    return {
      path: `/pages/index/index?inviter=${getApp().globalData.userInfo.id}`
    }
  },

    onInviteTap: function({ detail: { userInfo, errMsg }}) {
        if (errMsg !== 'getUserInfo:ok') return
        const id = getApp().globalData.userInfo.id
        wx.showLoading({ title: '请求中'})
        API.UPDATE_USER_INFO(id, { name: userInfo.nickName, avatar: userInfo.avatarUrl}).then(res => {
            wx.hideLoading()
            console.log(res)
        }).catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: err,
              icon: 'none'
            })
        }) 
    },

    onSelfTap: function() {
        wx.navigateTo({
          url: '/pages/enter/input',
        })
    }
})