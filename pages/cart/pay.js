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
    fromDetail: false,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ({fromDetail}) {
        this.fromDetail = fromDetail === '1'
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
        let goods = getApp().globalData.orderGoods.map(o => ({ ...o, check: false }))
        that.setData({
            goods: [...goods],
            sendMoney: projectInfo.open_send > 0 ? `¥${(projectInfo.send_money / 100).toFixed(2)}` : '免运费'
        })
        that.upFooter()
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
        if (orderType === 1 && !address) {
            wx.showToast({
                title: '请选择配送地址',
                icon: 'none'
            })
            return
        }
        let createOrderPromise = () => API.ORDER_CREATE({
            products: JSON.stringify(goods.map(o => ({ id: o.id, num: o.num }))),
            order_type: orderType === 2 ? 0 : 1,
            remark: remark,
            useravatar: avatarUrl,
            username: nickName,
            ...(orderType === 1 ? {
                send_address: `${address.userName} ${address.telNumber} ${address.provinceName}${address.cityName}${address.countyName}${address.detailInfo}`
            } : {})
        })
        this.checkGoodsInfo().then(() => createOrderPromise()).then(({ data }) => {
            wx.requestPayment({
                timeStamp: data.payinfo.timeStamp,
                nonceStr: data.payinfo.nonceStr,
                package: data.payinfo.package,
                signType: data.payinfo.signType,
                paySign: data.payinfo.paySign,
                success(_) {
                    !that.fromDetail && getApp().deleGoodsInCartAfterPay()
                    wx.redirectTo({ url: `/pages/cart/result?order_id=${data.order.id}&status=1` })
                },
                fail(_) {
                    !that.fromDetail && getApp().deleGoodsInCartAfterPay()
                    wx.redirectTo({ url: `/pages/cart/result?order_id=${data.order.id}&status=0` })
                }
            })
        }).catch(err => wx.showToast({ title: err, icon: 'none', duration: 3500 }))
    },

    onOrderTypeTap: function ({ currentTarget: { dataset: { value } } }) {
        this.setData({ orderType: value })
        this.upFooter()
    },

    upFooter: function () {
        let total = 0
        let { sendMoney, orderType, goods } = this.data
        goods.forEach(o => {
            total += o.showPrice * 1 * o.num
        })
        if (orderType === 1 && sendMoney !== '免运费') {
            total += sendMoney.substr(1) * 1
        }

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
    },

})