// pages/enter/input.js
import API from '../../api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: undefined,
        name: undefined,
        area: undefined,
        info: undefined,
        photo: undefined,
        licenese: undefined,
        latitude: undefined,
        longitude: undefined,
        open_send: 0,
        send_money: 0,
        man: '小姑2'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '填写入驻信息',
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onInput: function ({ target: { id }, detail: { value } }) {
        let tmp = {}
        tmp[id] = value
        this.setData({
            ...tmp
        })
    },

    onSendChange: function ({ detail: { value } }) {
        this.setData({ open_send: value ? 1 : 0 })
    },

    onLoationTap: function () {
        let that = this
        wx.chooseLocation({
            success: ({ errMsg, latitude, longitude }) => {
                if ('chooseLocation:ok' === errMsg) {
                    that.setData({
                        latitude: `${latitude}`,
                        longitude: `${longitude}`
                    })
                }
            }
        })
    },

    onEnterTap: function () {
        const { name = '', phone = '', latitude = '', longitude = '', send_money, open_send } = this.data
        if (phone.replace(/(^s*)|(s*$)/g, "").length == 0) {
            wx.showToast({ title: '请填写正确的“联系电话”', icon: 'none' })
            return
        }
        if (name.replace(/(^s*)|(s*$)/g, "").length == 0) {
            wx.showToast({ title: '请填写正确的“店铺名称”', icon: 'none' })
            return
        }
        if (latitude.replace(/(^s*)|(s*$)/g, "").length == 0) {
            wx.showToast({ title: '请填选择“地理位置”', icon: 'none' })
            return
        }
        if (open_send === 1) {
            if (!/^\d+(\.\d{1,2})?$/.test(send_money)) {
                wx.showToast({ title: '请填填写正确的“配送费用”', icon: 'none' })
                return
            }
        }
    },

    onPhotoTap: function () {
        let that = this
        if (this.data.photo) {
            wx.showActionSheet({
                itemList: ['查看', '修改'],
                success: ({ tapIndex }) => {
                    if (tapIndex === 1) {
                        this.chooseImageWithType('photo')            
                    } else {
                        let tmp = encodeURIComponent(that.data.photo)
                        wx.navigateTo({
                          url: '/pages/enter/picture?type=0&url=' + tmp,
                        })                        
                    }
                }
            })
        } else {
            this.chooseImageWithType('photo')
        }
    },

    onLiceneseTap: function () {
        let that = this
        if (this.data.licenese) {
            wx.showActionSheet({
                itemList: ['查看', '修改'],
                success: ({ tapIndex }) => {
                    if (tapIndex === 1) {
                        this.chooseImageWithType('licenese')            
                    } else {
                        let tmp = encodeURIComponent(that.data.licenese)
                        wx.navigateTo({
                          url: '/pages/enter/picture?type=1&url=' + tmp,
                        })                        
                    }
                }
            })
        } else {
            this.chooseImageWithType('licenese')
        }
    },

    chooseImageWithType: function (type) {
        let that = this
        let tmp = {}
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success({ tempFilePaths }) {
                wx.showLoading({
                  title: '上传中',
                })
                wx.uploadFile({
                    url: API.IMAGE_UPLOAD_URL,
                    filePath: tempFilePaths[0],
                    name: 'img',
                    formData: {
                        object: 0,
                        type: `shoptemplate/project/${type}`
                    },
                    header: {
                        Token: getApp().globalData.userInfo.token,
                    },
                    success({ data }) {
                        let res = JSON.parse(data)
                        wx.hideLoading()
                        tmp[type] = res.data
                        that.setData({
                            ...tmp
                        })
                    },
                    fail() {
                        wx.showToast({
                          title: '上传失败',
                          icon: 'none'
                        })
                    }
                })
            }
        })

    }


})