// pages/shoplist/index.js
import API from '../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },
    page: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.page = 1
        this.loadData()
        wx.hideHomeButton({
          success: (res) => {},
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

    
    loadData: function() {
        let that = this
        API.PROJECT_LIST(that.page).then(res => {            
            console.log(res)
            if (that.page === 1) {
                that.setData({ list: res.data})
            } else {
                that.setData({ list: [...that.data.list, res.data]})
            }
        }).catch(err => {
            wx.showToast({
              title: err,
              icon: 'none',
              duration: 2000
            })
        })
    },

    onShopTap: function({ currentTarget: { dataset: { id }} }) {
        wx.showLoading({
          title: '请求中...',
        })
        wx.setStorage({
          data: id,
          key: 'project',
          success: _ => {
            getApp().loadProjectInfo(id, (_, err) => {
                if (err) {
                    wx.showToast({
                      title: err,
                      icon: 'none'
                    })
                } else {
                    wx.hideLoading({
                        success: (res) => {
                            wx.reLaunch({
                              url: '/pages/home/index',
                            })
                        },
                      })      
                }
            })
          }
        })
        console.log(id)
    }
})