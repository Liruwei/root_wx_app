//app.js
import { POST } from './utils/network';
App({
  onLaunch: function () {
    this.handleLogin();
    this.initGlobalDataSync();
    this.showRedDot();
  },
  initGlobalDataSync: function() {
    let info = wx.getSystemInfoSync();
    let navigationBarHeight = info.statusBarHeight;
    if (info.system.includes('iOS')) {
      navigationBarHeight += 40;
    } else {
      navigationBarHeight += 48;
    }
    this.globalData.navigationBarHeight = `${navigationBarHeight}px`;
    this.globalData.statusBarHeight = `${info.statusBarHeight}px`;
  },
  showRedDot: function(cart_goods) {  
    if (getCurrentPages().length > 1) return;
    let count = 0;
    if (!cart_goods) {
      wx.getStorage({
        key: 'cart_goods', 
        success: res => {
          cart_goods = res.data || [];
          cart_goods.forEach( o => { count += o.num; });
          if (count > 0) {
            wx.showTabBarRedDot({ index: 1});
          } else {
            wx.hideTabBarRedDot({ index: 1});
          }      
        }
      })
    } else {
      cart_goods.forEach( o => { count += o.num; });
      if (count > 0) {
        wx.showTabBarRedDot({ index: 1});
      } else {
        wx.hideTabBarRedDot({ index: 1});
      }        
    }
  },
  addGoodsInCart: function( goods_id, num) {
    if (!this.handlePageWithStatus()) return;
    let that = this;
    const cart_goods = wx.getStorageSync('cart_goods') || [];
    let goodsIndex = -1;
    cart_goods.forEach( (o, i) => {
      if (o.id === goods_id) { goodsIndex = i; }
    });
    if (goodsIndex !== -1) {
      cart_goods[goodsIndex].num += num;
    } else {
      cart_goods.push({ id: goods_id, num: num});
    }
    wx.setStorage({
      data: cart_goods,
      key: 'cart_goods',
      success: function() {
        wx.showToast({ title: '成功加入购物车', icon: 'none' });
        that.showRedDot(cart_goods);
      },
      fail: function() {
        wx.showToast({ title: '加入购物车，失败', icon: 'none' });
      }
    })
  },
  changeGoodsInCart: function( goods_id, num) {
    if (!this.handlePageWithStatus()) return;
    let that = this;
    const cart_goods = wx.getStorageSync('cart_goods') || [];
    let goodsIndex = -1;
    cart_goods.forEach( (o, i) => {
      if (o.id === goods_id) { goodsIndex = i; }
    });
    if (goodsIndex !== -1) {
      if (num == 0) {
        cart_goods.splice(goodsIndex, 1);
      } else {
        cart_goods[goodsIndex].num = num;
      }
    } else {
      cart_goods.push({ id: goods_id, num: num});
    }
    wx.setStorageSync('cart_goods', cart_goods);
  },
  handleLogin: function() {
    const that = this;
    wx.login({
      success: ({ code }) => {
        POST('/v1/wx/user/login', { code }, result => {
          that.globalData.accountInfo = result.data;
          that.globalData.status = 1;
          that.handleStatus();
        }, error => {
          console.log(error);
        });
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  handleStatus: function(cb) {
    const that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.globalData.status = 2;
        } else {
          that.globalData.status = 3;
        }
      },
      complete: r => {
        cb && cb();
      }
    })
  },
  handlePageWithStatus: function() {
    if (this.globalData.status == 3) {
      wx.navigateTo({ url: '/pages/index/index' });
      return false;
    } 
    return true;
  },
  globalData: {
    status: 0,  // 0: 未登陆 1: 已经登陆 2: 拥有用户信息 3: 没有用户信息
    accountInfo: {},
    userInfo: null,
    navigationBarHeight: 60,
    statusBarHeight: 20,
    paymentInfo: {},
  }
})


/*
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
*/