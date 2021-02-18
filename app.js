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
  globalData: {
    userInfo: null,
    projectInfo: null
  }
})