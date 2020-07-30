const md5 = require('js-md5');
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
  const data = {
    ...params,
    project_id: 7
  }
  wx.request({
    url: `${host}${url}`,
    data: data,
    header: {
      ...sign(url, data)
    },
    method: 'GET',
    success: (result) => {
      if (result.data.message !== 'Success') {
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