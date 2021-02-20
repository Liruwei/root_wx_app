// pages/master/getmoney.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        money: '100.00',
        can: '90.00'
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