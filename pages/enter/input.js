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
        man: undefined,
        id: undefined,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ({ inviter }) {
        let that = this
        if (inviter) {
            this.inviter = inviter * 1
            API.GET_USER_INFO(this.inviter).then(({ data }) => {
                if (data) {
                    that.setData({
                        man: data.name || undefined
                    })
                }
            })
        } else {
            this.inviter = 0
        }
        
        wx.setNavigationBarTitle({
            title: '填写入驻信息',
        })
        let userInfo = getApp().globalData.userInfo.project || {}
        this.setData({
            ...userInfo,
            send_money: userInfo.send_money ? (userInfo.send_money / 100).toFixed(2) * 1 : 0
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
        try {
            let projectInfo = getApp().globalData.userInfo.project
            if (projectInfo.status === 1) {
                wx.showToast({
                    title: '您已入驻',
                    icon: 'none',
                    duration: 5000,
                    mask: true
                })
                getApp().globalData.projectInfo = projectInfo
                wx.setStorage({
                    data: projectInfo.id,
                    key: 'project',
                    success: _ => {
                        setTimeout(() => {
                            wx.reLaunch({
                                url: '/pages/home/index',
                            })
                        }, 5000);
                    }
                })
            }
        } catch (err) {
            console.log(err)
        }
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
        let that = this
        const { name = '', phone = '', latitude = '', send_money, open_send } = this.data
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

        wx.showLoading({
            title: '请求中',
        })
        let tmp = {
            ...this.data,
            send_money: this.data.send_money * 100
        }
        if (this.data.id) {
            API.PROJECT_UPDATE(this.data.id, tmp).then(({ data }) => {
                that.project = data.id
                that.onPay()
            }).catch(err => {
                wx.hideLoading()
                wx.showToast({
                    title: err,
                    icon: 'none'
                })
            })
        } else {
            API.ENTER({
                ...tmp,
                user_id: getApp().globalData.userInfo.id
            }).then(({ data }) => {
                that.project = data.id
                that.onPay()
            }).catch(err => {
                wx.hideLoading()
                wx.showToast({
                    title: err,
                    icon: 'none'
                })
            })
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
    },

    onPay: function () {
        let that = this
        API.ENTER_PAY({
            project: this.project,
            inviter: this.inviter
        }).then(({ data }) => {
            wx.requestPayment({
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign,
                success(_) {
                    that.checkPayResult(data.pay_no)
                },
                fail(_) {
                    wx.hideLoading({})
                    wx.showToast({
                        title: '支付失败',
                        icon: 'none'
                    })
                }
            })
        }).catch(err => {
            wx.hideLoading({})
            wx.showToast({
                title: err,
                icon: 'none'
            })
        })
    },

    checkPayResult: function (pay_no) {
        let that = this
        API.ENTER_PAY_RESULT(pay_no).then(({ data }) => {
            if (data) {
                wx.hideLoading()
                getApp().globalData.userInfo.project = data
                getApp().globalData.projectInfo = data
                wx.setStorageSync('project', data.id)
                wx.requestSubscribeMessage({
                    tmplIds: ['hMuSZePpSdryiyPHWdO74rFfzU-PYKqFRzfMiJt9mfs', 'dTCX8XZLoJ3EtDfjIBaOncR7Jg7uJA2MB-qX0m9egdM', 'HvmGYWg2gHNRkAfgSZa6Lds9ObvlXWkVm4rwWOeRu9o'],
                    success: _ => {
                        wx.redirectTo({ url: '/pages/enter/result' })
                    },
                    fail: _ => {
                        wx.redirectTo({ url: '/pages/enter/result' })
                    }
                })
            } else {
                setTimeout(() => {
                    that.checkPayResult(pay_no)
                }, 1000);
            }
        }).catch(err => {
            wx.hideLoading()
            wx.showToast({
                title: err,
                icon: 'none'
            })
        })
    }
})