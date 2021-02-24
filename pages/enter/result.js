// pages/enter/result.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      project: undefined
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '成功',
        })
        const project = getApp().globalData.userInfo.project

        this.setData({
          project: {
            ...project,
            create_time: (new Date(project.create_time * 1)).toLocaleString()
          }
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

    toHomeTap: function () {
      wx.reLaunch({
        url: '/pages/home/index',
      })
    }
})