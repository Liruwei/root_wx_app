// pages/home/index.js
import { GET } from '../../utils/network';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorys: [],
    goods: [],
    scrollId: null,
    refreshing: false
  },

  onLoad: function (options) {
    wx.showLoading({ title: '加载中' });
    this.loadData();
  },

  onReady: function () {},
  onShow: function () {
    app.showRedDot();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
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
        goods.push(...o.goods);
      });
      that.setData({
        categorys,
        goods,
        refreshing: false
      });
    }, error => {
      wx.showToast({ title: error, icon: 'none'});
      that.setData({ refreshing: false});
    });
  },

  onNormalGoodsTap: function({ currentTarget: { dataset: { id }} }) {
    app.addGoodsInCart(id, 1);
  },

  onCategoryTap: function({ currentTarget: { dataset: { index }}}) {
    const category = this.data.categorys[index];
    this.setData({
      scrollId: `id_${category.scrollId}`
    })
  }
})