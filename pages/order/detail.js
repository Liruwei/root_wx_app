// pages/order/detail.js
import API from '../../api'
import TOOL from '../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: undefined,
        master: false,
        showSendCode: false,
        showSendCodeContent: false,
    },
    order_id: undefined,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function ({ order_id, master }) {
        this.order_id = order_id
        this.setData({ master: master === 'true' })
        wx.setNavigationBarTitle({ title: '订单详情' })
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

    loadData: function () {
        let that = this
        wx.showLoading({ title: '请求中'})
        API.ORDER_INFO(this.order_id).then(res => {
            wx.hideLoading({})
            that.setData({ order: TOOL.formatOrderInfo(res.data) })
        }).catch(err => {
            wx.hideLoading({})
            wx.showToast({ title: err, icon: 'none' })
        })
    },

    onDeleteOrder: function () {
        let that = this
        wx.showModal({
            content: '确认删除订单？',
            cancelColor: '#cc9c00',
            confirmColor: '#d3d3d3',
            confirmText: '删除',
            success: ({ confirm }) => {
                if (!confirm) return
                wx.showLoading({ title: '请求中' })
                API.ORDER_DELETE(that.order_id).then(res => {
                    wx.hideLoading({})
                    try {
                        that.getOpenerEventChannel().emit('reloadData');    
                    } catch (_) {}
                    wx.showToast({
                        title: '删除成功',
                        duration: 2000
                    })
                    setTimeout(() => wx.navigateBack(), 2000)
                }).catch(err => {
                    wx.hideLoading({})
                    wx.showToast({
                        title: err,
                        icon: 'none'
                    })
                })
            }
        })
    },

    onRefundOrder: function () {
        wx.showToast({
            title: '请前往【我的】-【我的服务】-【联系商家】，电话咨询商家。',
            icon: 'none',
            duration: 5000
        })
    },

    onFinishOrder: function () {
        let that = this
        wx.showModal({
            title: this.data.order.order_type === 0 ? '完成订单' : '确认收货',
            content: '请确认已经查收商品。',
            cancelColor: '#cc9c00',
            confirmColor: '#d3d3d3',
            confirmText: this.data.order.order_type === 0 ? '完成' : '签收',
            success: ({ confirm }) => {
                if (!confirm) return
                wx.showLoading({ title: '请求中' })
                API.ORDER_FINISH(that.order_id).then(res => {
                    wx.hideLoading({})
                    wx.showToast({
                        title: '修改成功',
                        duration: 2000
                    })
                    try {
                        that.getOpenerEventChannel().emit('reloadData');
                    } catch(_) {}
                    setTimeout(() => that.loadData(), 2000)
                }).catch(err => {
                    wx.hideLoading({})
                    wx.showToast({
                        title: err,
                        icon: 'none'
                    })
                })
            }
        })
    },

    onPayOrer: function () {
        let that = this
        wx.showLoading({ title: '请求中', mask: true })
        API.ORDER_REPAY(this.order_id).then(({ data }) => {
            wx.requestPayment({
                timeStamp: data.payinfo.timeStamp,
                nonceStr: data.payinfo.nonceStr,
                package: data.payinfo.package,
                signType: data.payinfo.signType,
                paySign: data.payinfo.paySign,
                success(_) {
                    try {
                        that.getOpenerEventChannel().emit('reloadData');
                    } catch (_) { }
                    wx.requestSubscribeMessage({
                        tmplIds: ['hMuSZePpSdryiyPHWdO74rFfzU-PYKqFRzfMiJt9mfs', 'dTCX8XZLoJ3EtDfjIBaOncR7Jg7uJA2MB-qX0m9egdM', 'HvmGYWg2gHNRkAfgSZa6Lds9ObvlXWkVm4rwWOeRu9o'],
                        success: _ => { 
                            wx.hideLoading()
                            wx.navigateTo({ url: `/pages/cart/result?order_id=${data.order.id}&status=1` })
                        },
                        fail: _ => {
                            wx.hideLoading()
                            wx.navigateTo({ url: `/pages/cart/result?order_id=${data.order.id}&status=1` })
                        }
                    })
                },
                fail(_) {
                    wx.requestSubscribeMessage({
                        tmplIds: ['hMuSZePpSdryiyPHWdO74rFfzU-PYKqFRzfMiJt9mfs', 'dTCX8XZLoJ3EtDfjIBaOncR7Jg7uJA2MB-qX0m9egdM', 'HvmGYWg2gHNRkAfgSZa6Lds9ObvlXWkVm4rwWOeRu9o'],
                        success: _ => { 
                            wx.hideLoading()
                            wx.navigateTo({ url: `/pages/cart/result?order_id=${data.order.id}&status=0&fromDetail=1` })
                        },
                        fail: _ => {
                            wx.hideLoading()
                            wx.navigateTo({ url: `/pages/cart/result?order_id=${data.order.id}&status=0&fromDetail=1` })
                        }
                    })
                }
            })
        }).catch(err => {
            wx.showToast({
                title: err,
                icon: 'none'
            })
        });
    },

    onCopy: function ({ currentTarget: { dataset: { value } } }) {
        wx.setClipboardData({
            data: value || '',
        })
    },

    onSendOrder: function () {
        let that = this
        this.onCloseAddView()
        if ((this.data.order.send_code || '').length < 2) {
            wx.showToast({ title: '请输入正确物流单号', icon: 'none'})
            return
        }
        wx.showModal({
            title: this.data.order.status === 1 ? '确认发货' : '修改物流单号',
            confirmColor: '#cc9c00',
            cancelColor: '#d3d3d3',
            confirmText: this.data.order.status === 1 ? '发货' : '修改',
            success: ({ confirm }) => {
                if (!confirm) return
                wx.showLoading({ title: '请求中' })
                API.ORDER_SEND(that.order_id, that.data.order.send_code).then(_ => {
                    wx.hideLoading({})
                    wx.showToast({ title: '成功', duration: 2000})
                    try {
                        that.getOpenerEventChannel().emit('reloadData');    
                    } catch (_) {}
                    setTimeout(() => that.loadData(), 2000)
                }).catch(err => {
                    wx.hideLoading({})
                    wx.showToast({ title: err, icon: 'none' })
                })
            }
        })
    },

    onCancelOrder: function () {
        let that = this
        wx.showModal({
            title: '取消订单',
            content: '取消订单，金额原路返回客户。',
            cancelColor: '#cc9c00',
            confirmColor: '#d3d3d3',
            confirmText: '确认',
            success: ({ confirm }) => {
                if (!confirm) return
                wx.showLoading({ title: '请求中' })
                API.ORDER_CANCEL(that.order_id).then(_ => {
                    wx.hideLoading({})
                    wx.showToast({
                        title: '成功',
                        duration: 2000
                    })
                    try {
                        that.getOpenerEventChannel().emit('reloadData');
                    } catch (_) {}
                    setTimeout(() => wx.navigateBack(), 2000)
                }).catch(err => {
                    wx.hideLoading({})
                    wx.showToast({
                        title: err,
                        icon: 'none'
                    })
                })
            }
        })        
    },

    onCloseAddView: function () {
        if (this.addViewAnimating || !this.data.showSendCodeContent) return;
        this.addViewAnimating = true;
        let that = this;
        that.setData({ showSendCodeContent: false })
        setTimeout(() => {
            that.setData({ showSendCode: false })
        }, 300);
        setTimeout(() => {
            delete that.addViewAnimating
        }, 500);
    },

    onShowAddView: function () {
        if (this.addViewAnimating || this.data.showSendCode) return;
        this.addViewAnimating = true;
        this.setData({ showSendCode: true })
        this.setData({ showSendCodeContent: true })
        let that = this;
        setTimeout(() => {
            delete that.addViewAnimating
        }, 500);
    },

    onSendCodeInput: function({ detail: { value }}) {
        this.setData({
            order: {
                ...this.data.order,
                send_code: value
            }
        })
    },

    onMapTap: function() {
        let projectInfo = getApp().globalData.projectInfo
        if (!projectInfo.latitude) {
            wx.showToast({
              title: '商家未设置导航位置! 请前往【我的】-【我的服务】-【联系商家】电话咨询。',
              icon: 'none',
              duration: 5000
            })
            return
        }
        wx.openLocation({
            latitude: projectInfo.latitude * 1,
            longitude: projectInfo.longitude * 1,
            scale: 18,
            name: projectInfo.name
          })
    },
    toMyProjectTap: function() {
      getApp().toMyProject()
    }
})