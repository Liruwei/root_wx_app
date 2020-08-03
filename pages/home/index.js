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
    refreshing: false
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
        if (o.goods.length > 0) {
          o.goods[0].category = o.category
        }
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
      categoryIndex: index,
      scrollId: `id_${category.scrollId}`
    })
  },

  observeCategoryTitle: throttle(1000, (target) => {
    wx.createSelectorQuery().
    selectAll('#category_0,#category_1,#category_2').
    boundingClientRect().
    exec( r => {
      console.log(r);
    });
    // target.data.categorys.forEach( (o, index) => {
    //   wx.createSelectorQuery().
    //   select(`#category_${o.scrollId}`).
    //   boundingClientRect().
    //   exec( r => {
    //     if (r.length > 0) {
    //       console.log(`index-${index} ${(new Date()).toLocaleTimeString()}`, r[0].top);
    //       if (r[0].top >= -10 && r[0].top <= 100) {
    //         if (index != target.data.categoryIndex) {
    //           target.setData({ categoryIndex : index });

    //         }
    //       }
    //     }
    //   })
    // })
  }),

  onScrollviewScroll: function(e) {
    this.observeCategoryTitle(this);
  }
})