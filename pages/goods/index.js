// pages/goods/index.js
import { GET } from '../../utils/network';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarHeight: app.globalData.navigationBarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    goodsInfo: null,
    num: 1,
    types: [],
    typeSelecteds: [],
  },
  /**
   * 库存
   */
  _stocks: [], 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '加载中' });
    this.loadData(options.id);
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

  onCloseTap: function() {
    wx.navigateBack();
  },

  loadData: function(goods_id) {
    const that = this;
    GET(`/v1/wx/goods/${goods_id}`, {}, result => {
      wx.hideLoading();
      let { detail, classes, stock} = result;
      let types = [], typeSelecteds = [], price = detail.price, new_price = detail.new_price;
      if (detail.photos.length > 0) {
        detail.photos = detail.photos.split(',')
      }
      classes.forEach( o => {
        if ( o.items.length > 0) {
          typeSelecteds.push(o.items[0].id);
        } else {
          typeSelecteds.push(-1);
        }
        types.push({
          name: o.type.name,
          items: (o.items || []) .map(i => ({ name: i.name, id: i.id  }))
        });
      });
      let stockInfo;
      stock.forEach( o => {
        if (o.symbol_path == typeSelecteds.join(',')) {
          stockInfo = o;
        }
      })
      if (stockInfo) {
        price = stockInfo.price;
        new_price = stockInfo.new_price;
      }
      that._stocks = stock;
      that.setData({ 
        goodsInfo : detail,
        typeSelecteds: typeSelecteds,
        types: types,
        price: price,
        newPrice: new_price
      });
    }, error => {
      wx.showToast({ title: error, icon: 'none' });
    });
  },

  onAddTap: function() {
    let newNum = this.data.num + 1;
    if (this.getStock() >= newNum) {
      this.setData({
        num: newNum
      });  
    } else {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      });
    }
  },

  onDelTap: function() {
    this.setData({
      num: Math.max(1, this.data.num - 1)
    });
  },

  onAddToCart: function() {
    if (this.getStock() >= this.data.num) {
      const sku = this.getSku();
      app.addGoodsInCart(sku.id, this.data.num);
    } else {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      });
    }    
  },

  onBuyNow: function() {
    if (this.getStock() < this.data.num) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      });
      return;
    }

    let { goods, num, price, newPrice} = this.data;
    const sku = this.getSku();

    let total = 0, oldTotal = 0;
    if (newPrice > 0) {
      total = (newPrice * num).toFixed(1);
      oldTotal = (price * num).toFixed(1);
    } else {
      total = (price * num).toFixed(1);
    }
    

    app.globalData.paymentInfo = {
      fromType: 'detail',
      total: total,
      oldTotal: oldTotal,
      list: [{
        num: num,
        price: price,
        new_price: newPrice,
        name: goods.name,
        info: goods.info,
        photos: goods.photos,
        id: sku.id,
      }]
    };
    wx.navigateTo({
      url: '/pages/payment/index',
    });
  },
  onTypeTap: function({ currentTarget: { dataset: { id, index }} }) {
    let typeSelecteds = [...this.data.typeSelecteds];
    typeSelecteds[index] = id;

    let stockInfo = this.getSku(), price = this.data.price, new_price = this.data.newPrice;
    if (stockInfo) {
      price = stockInfo.price;
      new_price = stockInfo.new_price;
    }

    this.setData({
      typeSelecteds,
      price: price,
      newPrice: new_price
    });
  },
  getStock: function() {
    let stockInfo;
    this._stocks.forEach( o => {
      if (o.symbol_path == this.data.typeSelecteds.join(',')) {
        stockInfo = o;
      }
    });
    if (stockInfo) {
      return stockInfo.stock;
    } else {
      return 0;
    }
  },
  getSku: function() { 
    let stockInfo;
    this._stocks.forEach( o => {
      if (o.symbol_path == this.data.typeSelecteds.join(',')) {
        stockInfo = o;
      }
    });
    return stockInfo;
  }
})