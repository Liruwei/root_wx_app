// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    idEdit: false,
    checkAll: false,
    total: 0.0,
    checkNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.setNavigationBarTitle({
      title: '购物车',
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
    getApp().getCurrentCartInfo(res => {
      let items = res.map(o => ({ ...o, check: false }))
      that.setData({
        items: [...items],
      })
      that.upFooter(items)
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

  onEditTap: function () {
    this.setData({ isEdit: !this.data.isEdit })
  },

  onBuyTap: function () {
    // TODO: 检测库存
    if (this.data.items.filter(o => o.check).length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
    getApp().globalData.orderGoods = JSON.stringify(this.data.items.filter(o => o.check))
    wx.navigateTo({
      url: '/pages/cart/pay',
    })
  },

  onItemSelectTap: function ({ currentTarget: { dataset: { index}}}) {
    let items = this.data.items
    items[index].check = !items[index].check
    this.setData({
      items: [...items],
    })
    this.upFooter(items)
  },

  onSelectAll: function () {
    let checkAll = !this.data.checkAll
    let items = this.data.items
    items.forEach( o => {
      o.check = checkAll
    })
    this.setData({ checkAll, items: [...items]})
    this.upFooter(items)
  },

  upFooter: function(items) {
    let total = 0
    let checkNum = 0
    let checkAll = true
    items.forEach( o => {
      if (o.check) {
        total += o.num * o.showPrice * 1
        checkNum += 1
      } else {
        checkAll = false
      }
    })
    this.setData({
      total: (total * 1).toFixed(2),
      checkAll: checkAll,
      checkNum: checkNum
    })
  },

  onDeleSelectTap: function() {
    let that = this
    if (that.data.items.filter(o => o.check).length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return 
    }
    wx.showModal({
      content: '删除选中商品?',
      cancelColor: '#cc9c00',
      confirmText: '删除',
      success: ({ confirm }) => {
        if (confirm) {
          getApp().delGoodsFromCart(that.data.items.filter(o => o.check).map(o => o.id), () => {
            let items = that.data.items.filter(o => !o.check)
            that.setData({ items})
            that.upFooter(items)
          })
        }
      }
    })
  },
  onDel: function ({ currentTarget: { dataset: { index}}}) {
    let that = this
    let items = this.data.items 
    if (items[index].num === 1) {
      return
    }
    getApp().delToCart(items[index], 1, () => {
      items[index].num -= 1
      that.setData({ items: [...items]})
    })
  },
  onAdd: function ({ currentTarget: { dataset: { index}}}) {
    let that = this
    let items = this.data.items 
    getApp().addToCart(items[index], 1, () => {
      items[index].num += 1
      that.setData({ items: [...items]})
    })
  }
})