//app.js
App({
  onLaunch: function () {
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
    let count = 0;
    if (!cart_goods) {
      cart_goods = wx.getStorageSync('cart_goods') || [];
    }
    cart_goods.forEach( o => {
      count += o.num;
    });
    if (count > 0) {
      wx.showTabBarRedDot({ index: 2});
    } else {
      wx.hideTabBarRedDot({ index: 2});
    }
  },
  addGoodsInCart: function( goods_id, num) {
    const cart_goods = wx.getStorageSync('cart_goods') || [];
    let goodsIndex = -1;
    cart_goods.forEach( (o, i) => {
      if (o.id === goods_id) { goodsIndex = i; }
    });
    if (goodsIndex !== -1) {
      cart_goods[goodsIndex].num += 1;
    } else {
      cart_goods.push({ id: goods_id, num: 1});
    }
    wx.setStorage({
      data: cart_goods,
      key: 'cart_goods',
      success: function() {
        wx.showToast({ title: '成功加入购物车', icon: 'none' });
        this.showRedDot(cart_goods);
      },
      fail: function() {
        wx.showToast({ title: '加入购物车，失败', icon: 'none' });
      }
    })
  },
  globalData: {
    userInfo: null,
    navigationBarHeight: 60,
    statusBarHeight: 20,
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