// pages/master/getmoney.js
import API from '../../api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        money: '0.00',
        can: '0.00',
        total: '0.00',
        getmoney: '0'
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
        this.loadData()
    },

    loadData: function() {
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
            this.setData({ getmoney: '0'})
            return ''
        }
        if (value.length === 1 && '.' === value) {
            this.setData({ getmoney: '0'})
            return '0.'
        }
        let tmp = value.split('.')
        if (tmp.length == 2 && tmp[1].length > 2) {
            tmp = value.substring(0, value.length - tmp[1].length + 2)
            this.setData({ getmoney: tmp})
            return tmp
        }
        if (tmp.length >= 3) {
            tmp = value.substring(0, value.length -1)
            this.setData({ getmoney: tmp})
            return tmp
        }
        if (value * 1 > this.data.can * 1) {
            tmp = this.data.can
            this.setData({ getmoney: tmp})
            return tmp
        }
        this.setData({ getmoney: value})
        
    },

    onBtnTap: function() {
        let that = this
        // if (this.data.getmoney * 1 < 5) {
        //     wx.showToast({
        //       title: '最少提现¥5',
        //       icon: 'none'
        //     })
        //     return
        // }
        wx.showModal({
          cancelColor: '#cc9c00',
          confirmColor: '#dfdfdf',
          title: `提现`,
          content: `提现金额为¥${(this.data.getmoney *1).toFixed(2)}，每次提现将收取¥0.01作为手续费。`,
          success: ({ confirm }) => {
              if (confirm) {
                  wx.showLoading({ title : '请求中'})
                  API.WITHDRAW(that.data.getmoney * 100).then(_ => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '成功',
                      duration: 2000
                    })
                    that.setData({ getmoney: '0'})
                    setTimeout(()=> that.loadData(), 2000)
                  }).catch(err => {
                    wx.hideLoading()
                    wx.showToast({ title: err, icon: 'none'})
                  })
              }
          }
        })
    }
})