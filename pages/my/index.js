// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '-',
    isMaster: false,
    hasProject: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: getApp().globalData.userInfo.id
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
      isMaster: getApp().isMaster(),
      hasProject: getApp().hasProject()
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

  },

  onOrderTap: function ({ currentTarget: {dataset: {index}}}) {
    wx.navigateTo({
      url: `/pages/order/index?index=${index}`,
    })
  },

  onMasterTap: function () {
    wx.navigateTo({
      url: '/pages/master/money',
    })
  },

  onMasterOrderTap: function () {
    wx.navigateTo({
      url: '/pages/order/index?master=1',
    })
  },

  onPhoneTap: function() {
    try {
      wx.makePhoneCall({
        phoneNumber: getApp().globalData.projectInfo.phone 
      })  
    } catch(_){
      wx.showToast({
        title: '商家暂未设置联系电话',
        icon: 'none'
      })
    }
  },

  onAddressTap: function() {
    wx.chooseAddress({
      success: (result) => {},
    })
  },

  onContectTap: function() {
    
  },

  onEnterTap: function() {
    wx.navigateTo({
      url: '/pages/enter/index',
    })
  },
  toMyProjectTap: function() {
    getApp().toMyProject()
  }
})