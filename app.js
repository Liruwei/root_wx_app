//app.js
import API from './api';
App({
  onLaunch: function () {
    this.login()
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           // this.globalData.userInfo = res.userInfo
    //           console.log(res.userInfo)
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  login: function() {
    let that = this;
    wx.login({
      success: res => {
        API.LOGIN(res.code).then(res => {
          that.globalData.userInfo = res.data
          that.userInfoReadyCallback && that.userInfoReadyCallback(res.data)
        }).catch(e => {
          console.log(e)
        })
      }
    })
  },
  loadProjectInfo: function(id, cb) {
    let that = this;
    API.PROJECT_INFO(id).then(res => {
      that.globalData.projectInfo = res.data
      cb && cb(res.data, null)
    }).catch( err => {
      cb && cb(null, err)
    })
  },
  getCurrentCartInfo: function(cb) {
    let that = this
    that.getCartInfo(res => {
      cb && cb(res[that.globalData.projectInfo.id] || [])
    })
  },
  getCartInfo: function(cb) {
    wx.getStorage({
      key: 'cart',
      success: ({ data }) => {
        cb && cb(data)
      },
      fail: err => {
        cb && cb({})
      }
    })
  },
  delGoodsFromCart: function (ids = [], cb) {
    wx.showLoading({
      title: '请求中',
    })
    let that = this
    const project = this.globalData.projectInfo.id
    this.getCartInfo(res => {
      let list = res[project] || []
      let tmp = null
      let delList = []
      list.forEach(obj => {
        if (ids.includes(obj.id)) {
          delList.push(obj)
        }
      });
      list = list.filter(item => !delList.includes(item));
      res[project] = list
      wx.setStorage({
        data: {...res},
        key: 'cart',
        success: _ => {
          wx.hideLoading({})
          cb && cb()
        },
        fail: _ => {
          wx.hideLoading({})
        }
      })
    })      
  },
  delToCart: function(goods, num, cb) {
    wx.showLoading({
      title: '请求中',
    })
    let that = this
    const project = this.globalData.projectInfo.id
    this.getCartInfo(res => {
      let list = res[project] || []
      let tmp = null
      list.forEach(obj => {
        if (obj.id === goods.id) {
          obj.num -= num
          tmp = obj
        }
      });
      if (tmp && tmp.num <= 0) {
        list = list.filter(item => item.id !== tmp.id);
      }
      res[project] = list
      wx.setStorage({
        data: {...res},
        key: 'cart',
        success: _ => {
          wx.hideLoading({})
          cb && cb()
        },
        fail: _ => {
          wx.hideLoading({})
        }
      })
    })    
  },
  addToCart: function(goods, num, cb) {
    wx.showLoading({
      title: '请稍等',
    })
    let that = this
    const project = this.globalData.projectInfo.id
    this.getCartInfo(res => {
      let list = res[project] || []
      let tmp = null
      list.forEach(obj => {
        if (obj.id === goods.id) {
          obj.num += num
          tmp = obj
        }
      });
      if (!tmp) {
        tmp = {
          id: goods.id,
          name: goods.name,
          num: num,
          showPrice: goods.showPrice,
          photo: goods.photos[0]
        }
        list = [...list, tmp]
      }
      res[project] = list

      wx.setStorage({
        data: {...res},
        key: 'cart',
        success: _ => {
          wx.hideLoading({})
          cb && cb()
        },
        fail: _ => {
          wx.hideLoading({})
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    projectInfo: null,
    orderGoods: []
  }
})