// pages/cart/index.js
import { GET } from '../../utils/network';
const app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarHeight: app.globalData.navigationBarHeight,
    items: [],
    selecteds: {},
    total: 0,
    oldTotal: 0,
    status: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ status: app.globalData.status });
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
    this.setData({ status: app.globalData.status });
    
    app.showRedDot();
    const that = this;
    if (app.globalData.status > 0) {
      if (app.globalData.status != 3) {
        wx.showLoading({ title: '加载中' });
        that.updateItems();
      }
    } else {
      let time = setInterval(() => {
        if (app.globalData.status > 0 && app.globalData.status != 3) {
          wx.showLoading({ title: '加载中' });
          that.updateItems();
          clearInterval(time);
        }
      }, 500);  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  updateItems: function() {
    const that = this;
    wx.getStorage({
      key: 'cart_goods',
      success: ({ data = [] }) => {
        if (data.length > 0) {
          const ids = data.map(o => o.id);
          let items = [];
          let selecteds = {...that.data.selecteds};

          GET('/v1/wx/cart', {  filter: { id: ids } }, result => {
            ids.forEach( (id, idx)  => {
              result.forEach( goods => {
                if (goods.sku_id == id) {
                  items.push({
                    num: data[idx].num,
                    price: goods.price,
                    new_price: goods.new_price,
                    name: goods.name,
                    info: goods.info,
                    photos: (goods.photos || '').split(',')[0],
                    id: goods.id,
                    sku_id: goods.sku_id,
                    stock: goods.stock
                  });
                  if (!(id in selecteds)) {
                    selecteds[id] = true;
                  }
                }
              });
            });
            that.setData({ 
              items : items,
              selecteds : selecteds,
              ...that.calcMoney(items, selecteds)
            });
            wx.hideLoading();
          }, error => {
            wx.hideLoading();
          });
        } else {
          wx.hideLoading();
          that.setData({ 
            items : [],
            ...that.calcMoney([], {})
          });
        }
      },
      fail: error => {
        wx.hideLoading();
        that.setData({ 
          items : [],
          ...that.calcMoney([], {})
        });
      }
    })
  },

  onCartItemDel: function({ currentTarget: { dataset: { id }} }) {
    
    const that = this;

    let index = -1;
    let items = [...this.data.items];
    let selecteds = {...this.data.selecteds};
    items.forEach( (o, i) => {
      if (o.sku_id == id) {
        index = i;
      }
    });

    let goods = {...items[index]};
    goods.num -= 1;

    if (goods.num <= 0) {
      wx.showModal({
        title: '删除商品',
        content: goods.name,
        success: function( { confirm }) {
          if (confirm) {
            app.changeGoodsInCart(id, 0);
            items.splice(index, 1);
            delete selecteds[id];
            that.setData({ 
              items : items, 
              selecteds: selecteds,
              ...that.calcMoney(items, selecteds)
            });
          }
        }
      })
    } else {
      items.splice(index, 1, goods);
      this.setData({
        items: items,
        ...this.calcMoney(items, this.data.selecteds)
      });
    }
  },

  onCartItemAdd: function({ currentTarget: { dataset: { id }} }) {
    let items = [];
    this.data.items.forEach( o => {
      if (o.sku_id == id) {
        let newIndex = o.num + 1;
        if (newIndex > o.stock) {
          wx.showToast({
            title: '库存不足',
            icon: 'none'
          });
          o.num = o.stock;
        } else {
          o.num += 1;
          app.changeGoodsInCart(id, o.num);
        }
      }
      items.push(o);
    })
    this.setData({ 
      items: items,
      ...this.calcMoney(items, this.data.selecteds)
    });
  },

  onCartItemSelect: function({ currentTarget: { dataset: { id }} }) {
    let seleteds = {...this.data.selecteds};
    seleteds[id] = !seleteds[id];
    this.setData({ 
      selecteds : seleteds,
      ...this.calcMoney(this.data.items, seleteds)
    });
    
  },

  calcMoney: function(items, selecteds) {
    let total = 0, oldTotal = 0;
    items.forEach(goods => {
      if (selecteds[goods.sku_id]) {
        if (goods.new_price > 0) {
          total += goods.new_price * goods.num;
        } else {
          total += goods.price * goods.num
        }
        oldTotal += goods.price * goods.num;
      }
    });

    if (oldTotal == total) oldTotal = 0;
    return {
      oldTotal: oldTotal.toFixed(2),
      total: total.toFixed(2)
    };
  },

  toPayment: function() {
    const that = this;
    let items = [...this.data.items];
    let canPay = true;
    items.forEach( o => {
      if (o.num > o.stock) {
        wx.showModal({
          title: '库存不足，更新数量',
          content:  `${o.name}: ${o.num} => ${o.stock}`,
        })
        canPay = false;
        o.num = o.stock;
        app.changeGoodsInCart(o.sku_id, o.num);
        that.setData({ items: items})
        return;
      }
    });
    if (!canPay) return;
    let goods = this.data.items.filter( o => that.data.selecteds[o.sku_id]);
    if (goods.length == 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    app.globalData.paymentInfo = {
      fromType: 'cart',
      list: goods,
      total: this.data.total,
      oldTotal: this.data.oldTotal
    }
    wx.navigateTo({
      url: '/pages/payment/index',
    });
  },

  toAuthorityTap: function() {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },

  toAddGoods: function() {
    wx.switchTab({
      url: '/pages/home/index',
    })
  }

})