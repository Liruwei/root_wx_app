// pages/cart/pay.js
import API from '../../api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: undefined,
        orderType: 2,
        goods: [{}, {}],
        sendMoney: 0,
        total: 0,
        remark: undefined
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '提交订单',
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
        let that = this
        const projectInfo = getApp().globalData.projectInfo

        getApp().getCurrentCartInfo(res => {
            let goods = res.map(o => ({ ...o, check: false }))
            that.setData({
                goods: [...goods],
                sendMoney: projectInfo.open_send > 0 ? `¥${(projectInfo.send_money / 100).toFixed(2)}` : '免运费'
            })
            that.upFooter()
        })

        wx.showLoading({ title: '加载中' })
        getApp().loadProjectInfo(projectInfo.id, (res, err) => {
            wx.hideLoading({})
            if (!err) {
                that.setData({
                    sendMoney: res.open_send > 0 ? `¥${(res.send_money / 100).toFixed(2)}` : '免运费'
                })
                that.upFooter()
            }
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

    checkGoodsInfo: function () {
        return new Promise((resolve, reject) => {
            let that = this
            let { goods } = this.data
            let gids = goods.map(o => o.id)
            getApp().checkGoodsInfo((err, datas) => {
                if (err) {
                    datas.forEach(o => {
                        let index = gids.indexOf(o.id)
                        goods[index] = { ...goods[index], ...o }
                    })
                    that.setData({ goods: goods })
                    that.upFooter()
                    reject(typeof (err) === 'string' ? err : '失败',)
                } else {
                    resolve()
                }
            })
        })
    },

    onPayTap: function ({ detail: { userInfo } }) {
        if (!userInfo) return
        let that = this
        const { nickName, avatarUrl } = userInfo
        const { remark, goods, orderType, address } = this.data
        let checkInfoPromise = this.checkGoodsInfo()
        let createOrderPromise = API.ORDER_CREATE({
            products: JSON.stringify(goods.map(o => ({ id: o.id, num: o.num}))),
            order_type: orderType === 2 ? 0 : 1,
            remark: remark,
            useravatar: avatarUrl,
            username: nickName,
            ...(orderType===1?{
                send_address: `${address.userName} ${address.telNumber} ${address.provinceName}${address.cityName}${address.countyName}${address.detailInfo}`
            } : {})
        })
        Promise.all([checkInfoPromise, createOrderPromise]).then(([_, orderInfo]) => {
            wx.requestPayment({
                timeStamp: '',
                nonceStr: '',
                package: '',
                signType: 'MD5',
                paySign: '',
                success(res) { },
                fail(res) { }
            })
        }).catch(err => {
            wx.showToast({
                title: err,
                icon: 'none',
                duration: 3500
            })
        })


        // wx.redirectTo({
        //     url: '/pages/cart/result',
        // })
    },

    onOrderTypeTap: function ({ currentTarget: { dataset: { value } } }) {
        this.setData({ orderType: value })
    },

    upFooter: function () {
        let total = 0
        let { sendMoney, orderType, goods } = this.data
        goods.forEach(o => {
            total += o.showPrice * 1 * o.num
        })
        total += orderType === 1 ? sendMoney * 1 : 0
        this.setData({ total: total.toFixed(2) })
    },

    onChooseAddress: function () {
        let that = this
        wx.chooseAddress({
            success: (result) => {
                that.setData({ address: result })
            },
        })
    },

    onRemarkInput: function ({ detail: { value } }) {
        this.setData({ remark: value })
    }
})