// pages/index/index.js
Page({
    data: {},
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '加载中',
        })
        let that = this
        console.log(options)
        if (getApp().globalData.userInfo) {
            that.handleRoute(options)
        } else {
            getApp().userInfoReadyCallback = _ => {
                that.handleRoute(options)
            }    
        }
    },

    handleRoute: function ({ project, inviter, product}) {
        let that = this
        if (inviter) {
            wx.reLaunch({
              url: `/pages/enter/input?inviter=${inviter}`,
            })
            return
        }
        if (project && product) {
            getApp().loadProjectInfo(project * 1, (res, err) => {
                if (err || (res && res.status === 0)) {
                    that.handleRoute({})
                } else {
                    wx.reLaunch({
                      url: `/pages/goods/detail?id=${product}`,
                    })
                }
            })
            return
        }
        if (project) {
            getApp().loadProjectInfo(project * 1, (res, err) => {
                if (err || (res && res.status === 0)) {
                    that.handleRoute({})
                } else {
                    wx.reLaunch({
                      url: '/pages/home/index',
                    })
                }
            })
            return            
        }
        wx.getStorage({
            key: 'project',
            success: ({ data }) => {
                getApp().loadProjectInfo(data, (res, err) => {
                    if (err || (res && res.status === 0)) {
                        wx.clearStorage({
                          success: (_) => {
                            console.log('project 有问题')
                            wx.reLaunch({
                                url: '/pages/shoplist/index',
                            })    
                          },
                          fail: _ =>{
                            console.log('project 有问题')
                            wx.reLaunch({
                                url: '/pages/shoplist/index',
                            })    
                          }
                        })
                    } else {
                        wx.reLaunch({
                            url: '/pages/home/index',
                        })
                    }
                })
            },
            fail: _ => {
                console.log('本地不存在 project')
                wx.reLaunch({
                    url: '/pages/shoplist/index',
                })
            }
        })
    }
})