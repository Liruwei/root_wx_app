// pages/home/index.js
import { GET } from '../../utils/network';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorys: [],
    goods: []
  },

  onLoad: function (options) {
    this.loadData();
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function (e) {},

  onGoodsTap: function(e) {
    wx.navigateTo({
      url: '/pages/goods/index',
    })
  },

  loadData: function () {
    let that = this;
    wx.showLoading({ title: '加载中' });
    GET('/v1/wx/categories/goods', {}, result => {
      wx.hideLoading();
      let categorys = []
      let goods = []
      result.data.forEach(o => {
        categorys.push({
          icon: o.icon,
          name: o.category
        });
        goods.push(...o.goods);
      });
      that.setData({
        categorys,
        goods
      });
    }, error => {
      wx.hideLoading();
    });
  },

  onNormalGoodsTap: function({ currentTarget: { dataset: { id }}}) {
    app.addGoodsInCart(id, 1);
  }
})