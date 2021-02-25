//app.js
import API from './api';
App({
  onLaunch: function () {
    // this.login()
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
  login: function () {
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
  loadProjectInfo: function (id, cb) {
    let that = this;
    API.PROJECT_INFO(id).then(res => {
      wx.setStorage({
        data: res.data.id,
        key: 'project',
        success: _ => {
          that.globalData.projectInfo = res.data
          cb && cb(res.data, null)    
        }
      })
    }).catch(err => {
      cb && cb(null, err)
    })
  },
  getCurrentCartInfo: function (cb) {
    let that = this
    that.getCartInfo(res => {
      cb && cb(res[that.globalData.projectInfo.id] || [])
    })
  },
  getCartInfo: function (cb) {
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
  delGoodsFromCartSync: function (goods) {
    try {
      let project = this.globalData.projectInfo.id
      let cart = wx.getStorageSync('cart') || {}
      let list = cart[project] || []
      let ids = goods.map(o => o.id)
      list = list.map(o => {
        let index = ids.indexOf(o.id)
        if (index >= 0) {
          let tmp = {...goods[index]}
          delete tmp.didUpdate
          o = {...o, ...tmp}
        }
        return o
      })
      list = list.filter(o => o.num > 0)
      cart[project] = [...list]
      wx.setStorageSync('cart', cart)
    } catch (err) {
      console.log(err)
    }
  },
  delGoodsFromCart: function (ids = [], cb, loading=true) {
    loading && wx.showLoading({ title: '请求中' })
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
        data: { ...res },
        key: 'cart',
        success: _ => {
          loading && wx.hideLoading({})
          cb && cb()
        },
        fail: _ => {
          loading && wx.hideLoading({})
        }
      })
    })
  },
  delToCart: function (goods, num, cb) {
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
        data: { ...res },
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
  addToCart: function (goods, num, cb) {
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
        data: { ...res },
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
  checkGoodsInfo: function (cb, showLoading=true) {
    let that = this
    let orderGoods = [...this.globalData.orderGoods]
    let gids = this.globalData.orderGoods.map(o => o.id)
    let project = this.globalData.projectInfo.id
    showLoading && wx.showLoading({ title: '请求中' })
    API.HOME_GOODS(1, project, { id: gids }, 10000).then(({ data }) => {
      let msg = undefined
      data.forEach(item => {
        let index = gids.indexOf(item.id)
        if (index >= 0) {
          orderGoods[index].didChecked = true
          const showPrice = ((item.is_discounts === 1 ? item.discounts_price : item.price) / 100).toFixed(2)
          if (orderGoods[index].num > item.stock) {
            orderGoods[index].num = Math.max(0, item.stock)
            orderGoods[index].didUpdate = true
            msg = '商品信息有变动，请核实。'
          }
          if (orderGoods[index].showPrice * 1 - showPrice * 1 !== 0) {
            orderGoods[index].showPrice = showPrice
            orderGoods[index].didUpdate = true
            msg = '商品信息有变动，请核实。'
          }
        }
      })
      orderGoods.forEach(o => {
        if (!o.didChecked) {
          o.num = 0
          o.didUpdate = true
          msg = '商品信息有变动，请核实。'
        }
        delete o.didChecked
      })
      that.delGoodsFromCartSync(orderGoods.filter(o => o.didUpdate))
      showLoading && wx.hideLoading({})
      cb && cb(msg, orderGoods)
    }).catch(err => {
      showLoading && wx.hideLoading({})
      cb && cb(err, orderGoods)
    })
  },
  deleGoodsInCartAfterPay: function () {
    this.delGoodsFromCart(this.globalData.orderGoods.map(o => o.id), null, false)
  },
  isMaster: function(){
    try {
      const { projectInfo, userInfo: { project }} = this.globalData
      if (project.status === 1 && projectInfo.id == project.id) {
        return true
      }
      return false
    } catch(e) {
      return false
    }
  },
  hasProject: function(){
    try {
      const {projectInfo, userInfo: { project }} = this.globalData
      if (project && project.status === 1 ) {
        if (projectInfo && projectInfo.id === project.id) {
          return false
        }
        return true
      }
      return false
    } catch(e) {
      return false
    }
  },
  toMyProject: function() {
    wx.setStorageSync('project', this.globalData.userInfo.project.id)
    this.globalData.projectInfo = this.globalData.userInfo.project
    wx.reLaunch({
      url: '/pages/home/index',
    })
  },
  globalData: {
    userInfo: null,
    projectInfo: null,
    orderGoods: []
  }
})