// pages/cart/index.js
import { GET } from '../../utils/network';
const app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarHeight: app.globalData.navigationBarHeight,
    items: []
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
    wx.showLoading({ title: '加载中' });
    app.showRedDot();
    const that = this;
    if (app.globalData.status > 0) {
      that.updateItems();
    } else {
      let time = setInterval(() => {
        if (app.globalData.status > 0) {
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
          GET('/v1/shop/goods', {  filter: { id: ids } }, result => {
            ids.forEach( (id, idx)  => {
              result.forEach( goods => {
                if (goods.id == id) {
                  items.push({
                    num: data[idx].num,
                    price: goods.price,
                    new_price: goods.new_price,
                    name: goods.name,
                    info: goods.info,
                    photos: goods.photos,
                    id: goods.id
                  });
                }
              });
            });
            that.setData({ items : items });
            wx.hideLoading();
          }, error => {
            wx.hideLoading();
          });
        } else {
          wx.hideLoading();
          that.setData({ items : [] });
        }
      },
      fail: error => {
        wx.hideLoading();
        that.setData({ items : [] });
      }
    })
  },

  onCartItemDel: function({ currentTarget: { dataset: { id }} }) {
    
    const that = this;

    let index = -1;
    let items = [...this.data.items];
    items.forEach( (o, i) => {
      if (o.id == id) {
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
            that.setData({ items : items });
          }
        }
      })
    } else {
      items.splice(index, 1, goods);
      this.setData({
        items: items
      });
    }
  },

  onCartItemAdd: function({ currentTarget: { dataset: { id }} }) {
    let items = [];
    this.data.items.forEach( o => {
      if (o.id == id) {
        o.num += 1;
        app.changeGoodsInCart(id, o.num);
      }
      items.push(o);
    })
    this.setData({ items: items });
  },
})