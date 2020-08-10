const md5 = require('js-md5');
// const host = 'http://192.168.31.34:5000';
const host = 'http://localhost:5000';
const project_id = '7';

const sign = (url = '' ,params = {}) => {
  const nowTime = (new Date()).getTime();
  const signDic = {
    _url : url,
    _time : nowTime,
    ...params
  }
  let signArray = [];
  Object.keys(signDic).sort().forEach( key => {
    signArray.push(`${key}=${signDic[key]}`)
  });
  const signStr = signArray.join('&');
  return {
    'Sign-Time': nowTime,
    'Sign': md5(signStr)
  }
}

export const GET = (url, params, success = null, fail = null) => {
  const app = getApp();
  const data = {
    ...params,
    project_id: project_id
  }
  wx.request({
    url: `${host}${url}`,
    data: data,
    header: {
      token: app.globalData.accountInfo.token || '',
      ...sign(url, data)
    },
    method: 'GET',
    success: (result) => {
      if (result.statusCode !== 200) {
        fail && fail(`${result.statusCode}`);
      } else {
        success && success(result.data);
      }
    },
    fail: (res) => {
      fail && fail(res);
    },
  })
}

export const POST = (url, params, success = null, fail = null) => {
  const app = getApp();
  const data = {
    ...params,
    project_id: project_id
  }
  wx.request({
    url: `${host}${url}`,
    data: data,
    header: {
      token: app.globalData.accountInfo.token || '',
      ...sign(url, data)
    },
    method: 'POST',
    success: (result) => {
      if (result.statusCode !== 200) {
        fail && fail(`${result.statusCode}`);
      } else if (result.data.message !== 'Success') {
        fail && fail(result.data.message);
      } else {
        success && success(result.data);
      }
    },
    fail: (res) => {
      fail && fail(res);
    },
  })
}

export const PUT = (url, params, success = null, fail = null) => {
  const app = getApp();
  const data = {
    ...params,
    project_id: project_id
  }
  wx.request({
    url: `${host}${url}`,
    data: data,
    header: {
      token: app.globalData.accountInfo.token || '',
      ...sign(url, data)
    },
    method: 'PUT',
    success: (result) => {
      if (result.statusCode !== 200) {
        fail && fail(`${result.statusCode}`);
      } else if (result.data.message !== 'Success') {
        fail && fail(result.data.message);
      } else {
        success && success(result.data);
      }
    },
    fail: (res) => {
      fail && fail(res);
    },
  })
}