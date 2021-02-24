// pages/index/index.js
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
        let that = this
        if (getApp().globalData.userInfo) {
            that.handleRoute(options)
        } else {
            getApp().userInfoReadyCallback = _ => {
                that.handleRoute(options)
            }    
        }
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

    onHomeBtnTap: function () {
        wx.reLaunch({
            url: '/pages/home/index',
        });
    },

    handleRoute: function (options) {
        console.log('options: ', options)
        let type = 0
        let that = this
        if (type === 0) {
            wx.getStorage({
                key: 'project',
                success: ({ data }) => {
                    that.loadShopInfo(data)
                },
                fail: _ => {
                    // wx.reLaunch({
                    //     url: '/pages/shoplist/index',
                    // })
                    wx.reLaunch({
                        url: '/pages/enter/input',
                      })     
                }
            })
        }

    },
    loadShopInfo: function (id) {
        wx.showLoading({
            title: '请求中...',
        })
        getApp().loadProjectInfo(id, (_, err) => {
            if (err) {
                wx.showToast({
                    title: err,
                    icon: 'none'
                })
                wx.removeStorageSync('project')
                wx.reLaunch({
                    url: '/pages/shoplist/index',
                })
            } else {
                wx.hideLoading({
                    success: _ => {
                        // wx.reLaunch({
                        //     url: '/pages/enter/input',
                        //   })          
                        wx.reLaunch({
                            url: '/pages/home/index',
                        })
                    },
                })
            }
        })
    }
})