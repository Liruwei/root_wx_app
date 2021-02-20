// const API_HOST = "http://localhost:5000"
const API_HOST = "http://192.168.10.188:5000"


function GET(url, data, success, fail) {
    let userInfo = getApp().globalData.userInfo
    let header = {}
    if (userInfo) {
        header.Token = userInfo.token
    }
    wx.request({
        url: `${API_HOST}${url}`,
        data: data,
        header: {
            'content-type': 'text/plain',
            ...header
        },
        success(res) {
            if (res.data.message === 'Success') {
                success && success(res.data)
            }
            else if (typeof(res.data.message) === 'string') {
                fail && fail(res.data.message)
            } else {
                fail && fail(JSON.stringify(res.data.message))
            }
        },
        fail(e) {
            fail && fail(e)
        }
    })
}

function POST(url, data, success, fail) {
    wx.request({
        url: `${API_HOST}${url}`,
        method: 'POST',
        data: data,
        header: {
            'content-type': 'application/json'
        },
        success(res) {
            if (res.data.message === 'Success') {
                success && success(res.data)
            }
            else if (typeof(res.data.message) === 'string') {
                fail && fail(res.data.message)
            } else {
                fail && fail(JSON.stringify(res.data.message))
            }
        },
        fail(e) {
            fail && fail(e)
        }
    })
}

function PROJECT_LIST(page=1) {
    return new Promise((resolve, reject) => {
        GET('/shoptemplate/projects', {
            filter: {status: 1},
            range: [page, 20]
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function LOGIN(data) {
    return new Promise((resolve, reject) => {
        POST('/shoptemplate/user/wxlogin', {
            code: data,
            object: -100
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function PROJECT_INFO(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/project/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function HOME_BANNERS(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/banners`, {
            filter: {project:id}
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function HOME_GOODS(page, pid) {
    return new Promise((resolve, reject) => {
        GET('/shoptemplate/products', {
            filter: {project: pid},
            range: [page, 20]
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function HOME_CATEGORYS(pid) {
    return new Promise((resolve, reject) => {
        GET('/shoptemplate/categorys', {
            filter: {project: pid},
            range: [1, 1000]
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function GOODS_INFO(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/product/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

export default {
    LOGIN,
    PROJECT_LIST,
    PROJECT_INFO,
    HOME_BANNERS,
    HOME_GOODS,
    HOME_CATEGORYS,
    GOODS_INFO
}