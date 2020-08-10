// pages/home/index.js
import { GET } from '../../utils/network';
import { throttle } from 'throttle-debounce';
console.log(throttle);
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorys: [],
    categoryIndex: 0,
    goods: [],
    scrollId: null,
    price: 0,
    newPrice: 0
  },

  onLoad: function (options) {
    wx.showLoading({ title: '加载中' });
    this.loadData();
  },

  onReady: function () {
  },
  onShow: function () {
    app.showRedDot();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function (e) {},

  onGoodsTap: function({ currentTarget: { dataset: { id }} }) {
    wx.navigateTo({
      url: '/pages/goods/index?id=' + id,
    })
  },

  loadData: function () {
    let that = this;
    GET('/v1/wx/categories/goods', {}, result => {
      wx.hideLoading();
      let categorys = []
      let goods = []
      result.data.forEach(o => {
        categorys.push({
          icon: o.icon,
          name: o.category,
          scrollId: goods.length
        });
        if (o.goods.length > 0) {
          o.goods[0].category = o.category
        }
        goods.push(...o.goods);
      });
      goods.forEach( o => {
        if (o.photo.length > 0) {
          o.photo = o.photo.split(',')[0]
        }
      })
      that.setData({
        categorys,
        goods
      });
      wx.stopPullDownRefresh();
    }, error => {
      wx.showToast({ title: error, icon: 'none'});
      wx.stopPullDownRefresh();
    });
  },

  onNormalGoodsTap: function({ currentTarget: { dataset: { id }} }) {
    wx.navigateTo({
      url: '/pages/goods/index?id=' + id,
    })
    // app.addGoodsInCart(id, 1);
  },

  onCategoryTap: function({ currentTarget: { dataset: { index }}}) {
    const category = this.data.categorys[index];
    this.setData({
      categoryIndex: index,
      scrollId: `id_${category.scrollId}`
    })
    this._updateCategoryCan = false;
  },

  observeCategoryTitle: throttle(1000, (target) => {
    target._updateCategoryTempDic = {};
    target.data.categorys.forEach( (o, index) => {
      wx.createSelectorQuery().
      select(`#category_${o.scrollId}`).
      boundingClientRect().
      exec( r => {
        if (r.length > 0) {
          target._updateCategoryIndex(index, Math.abs(r[0].top));
        } else {
          target._updateCategoryIndex(index, 99999);
        }
      });
    })
  }),

  _updateCategoryTempDic: {},
  _updateCategoryCan: true,
  _updateCategoryIndex: function(index, value) {
    this._updateCategoryTempDic[`${index}`] = value;
    const keys = Object.keys(this._updateCategoryTempDic);
    if (keys.length == this.data.categorys.length) {
      let index = 0, value = this._updateCategoryTempDic['0'];
      for (let i = 1; i < keys.length; i++) {
        const tempValue = this._updateCategoryTempDic[`${i}`];
        if (tempValue < value) {
          index = i;
          value = tempValue;
        }
      }
      this.setData({
        categoryIndex: index
      });
      this._updateCategoryCan = true;
    }
  },

  onScrollviewScroll: function(e) {
    if (this._updateCategoryCan) {
      this.observeCategoryTitle(this);
    } 
      
    this._updateCategoryCan = true;
  },

})