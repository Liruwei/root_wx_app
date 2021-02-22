// pages/master/getmoney.js
import API from '../../api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        money: '0.00',
        can: '0.00',
        total: '0.00'
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
        wx.showLoading({ title: '请求中'})
        API.PROJECT_MONEY(getApp().globalData.projectInfo.id).then(({ data: { canMoney, totalMoney, currentMoney} }) => {
            wx.hideLoading()
            this.setData({
                can: (canMoney / 100).toFixed(2),
                total: (totalMoney / 100).toFixed(2),
                money: (currentMoney / 100).toFixed(2)
            })
        }).catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: err,
              icon: 'none'
            })
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

    bindinput: function ({ detail: { value}}) {
        if (value.length === 1 && '0' === value) {
            return ''
        }
        if (value.length === 1 && '.' === value) {
            return '0.'
        }
        let tmp = value.split('.')
        if (tmp.length == 2 && tmp[1].length > 2) {
            return value.substring(0, value.length - tmp[1].length + 2)
        }
        if (tmp.length >= 3) {
            return value.substring(0, value.length -1)
        }
        if (value * 1 > this.data.can * 1) {
            return this.data.can
        }
    }
})