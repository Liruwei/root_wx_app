// pages/index/index.js
Page({
    data: {},
    options: {},
    onLoad: function (options) {
        this.options = options
        wx.setNavigationBarTitle({
          title: '加载中',
        })
        getApp().login()
        console.log(options)
    },

    onShow: function() {
        let that = this
        getApp().userInfoReadyCallback = _ => {
            that.handleRoute(that.options)
        }
    },

    handleRoute: function ({ project, inviter, product}) {
        this.options = { project }
        let that = this
        if (inviter) {
            wx.reLaunch({
              url: `/pages/enter/input?inviter=${inviter}`,
            })
            return
        }
        else if (project && product) {
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
        else if (project) {
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
        } else {
            wx.getStorage({
                key: 'project',
                success: ({ data }) => {
                    getApp().loadProjectInfo(data, (res, err) => {
                        if (err || (res && res.status === 0)) {
                            wx.clearStorage({
                              success: (_) => {
                                console.log('project 有问题')
                                that.handleRoute({ project: 1})
                                // wx.reLaunch({
                                //     url: '/pages/shoplist/index',
                                // })    
                              },
                              fail: _ =>{
                                console.log('project 有问题')
                                that.handleRoute({ project: 1})
                                // wx.reLaunch({
                                //     url: '/pages/shoplist/index',
                                // })    
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
                    that.handleRoute({ project: 1})
                    // wx.reLaunch({
                    //     url: '/pages/shoplist/index',
                    // })
                }
            })
        }
    }
})