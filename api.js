// const API_HOST = "http://localhost:5000"
const API_HOST = "http://192.168.10.209:5000"

const md5 = require('js-md5');
function Sign(params) {
    let accessKey = '-maves@shoptemplate-MjAyMTAxMDFINQ==';
    let accessTime = (new Date()).getTime()
    let secretKey = ''
    if (getApp().globalData.userInfo) {
        secretKey = getApp().globalData.userInfo.token
    }     
    let keys = Object.keys(params);
    keys.sort();
    let kv = keys.map( k => `${k}=${params[k]}`);
    kv = [
        `accessKey=${accessKey.toLocaleLowerCase()}`, 
        `accessTime=${accessTime}`,
        ...kv,
        `secretKey=${secretKey.toLocaleLowerCase()}`
    ];
    let sign = md5(kv.join('&'));
    return {
        Token: secretKey,
        'Access-Time': accessTime,
        'Access-Sign': sign
    }
}

function DefaultHeader() {
    let userInfo = getApp().globalData.userInfo
    let header = {}
    if (userInfo) {
        header.Token = userInfo.token
        header['Open-Id'] = userInfo.openid
    }
    return header
}

function DELETE(url, data, success, fail) {
    let userInfo = getApp().globalData.userInfo
    let header = {}
    if (userInfo) {
        header.Token = userInfo.token
    }
    wx.request({
        url: `${API_HOST}${url}`,
        data: data,
        method: 'DELETE',
        header: {
            'content-type': 'application/json',
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

function PUT(url, data, success, fail) {
    wx.request({
        url: `${API_HOST}${url}`,
        data: data,
        method: 'PUT',
        header: {
            'content-type': 'application/json',
            ...(Sign(data))
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
    let otherHeader = {}
    let userInfo = getApp().globalData.userInfo
    if (userInfo) {
        otherHeader['Token'] = userInfo.token || ''
        otherHeader['Open-Id'] = userInfo.openid || ''
    }
    if (data._sign) {
        delete data._sign
        otherHeader = {
            ...otherHeader,
            ...Sign(data)
        }
    }
    wx.request({
        url: `${API_HOST}${url}`,
        method: 'POST',
        data: data,
        header: {
            'content-type': 'application/json',
            ...otherHeader
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

function WITHDRAW(money) {
    return new Promise((resolve, reject) => {
        let openid = ''
        if (getApp().globalData.userInfo) {
            openid = getApp().globalData.userInfo.openid
        }
        POST('/shoptemplate/withdraw', {
            openid: openid,
            money: money,
            _sign: true
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

function PROJECT_MONEY(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/projectmoney/${id}`, {
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

function HOME_GOODS(page, pid, filter={}, pageSize=20) {
    return new Promise((resolve, reject) => {
        GET('/shoptemplate/products', {
            filter: {
                project: pid,
                ...filter
            },
            range: [page, pageSize]
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

function ORDER_CREATE(data={}) {
    return new Promise((resolve, reject) => {
        POST('/shoptemplate/orders', {
            ...data,
            project: getApp().globalData.projectInfo.id
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_REPAY(order_id) {
    return new Promise((resolve, reject) => {
        POST('/shoptemplate/wxorders/repay', {
            order_id,
            project: getApp().globalData.projectInfo.id
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_INFO(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/order/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });    
}

function ORDER_FINISH(id) {
    return new Promise((resolve, reject) => {
        PUT(`/shoptemplate/order/${id}`, {
            status: 2
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_CANCEL(id) {
    return new Promise((resolve, reject) => {
        PUT(`/shoptemplate/orderrefund/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_SEND(id ,code) {
    return new Promise((resolve, reject) => {
        PUT(`/shoptemplate/order/${id}`, {
            status: 3,
            send_code: code
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_LIST(page, pid, filter={}, pageSize=10) {
    return new Promise((resolve, reject) => {
        GET('/shoptemplate/wxorders', {
            filter: {
                project: pid,
                ...filter
            },
            sort: ['update_time', 'DESC'],
            range: [page, pageSize]
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_CHECK(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/ordercheck/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });    
}

function ORDER_DELETE(id) {
    return new Promise((resolve, reject) => {
        DELETE(`/shoptemplate/order/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ORDER_FINISH(id) {
    return new Promise((resolve, reject) => {
        PUT(`/shoptemplate/order/${id}`, {
            status: 2
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function UPDATE_USER_INFO(id ,data) {
    return new Promise((resolve, reject) => {
        PUT(`/shoptemplate/user/${id}`, {
            ...data
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function GET_USER_INFO(id) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/user/${id}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ENTER(data) {
    return new Promise((resolve, reject) => {
        POST('/shoptemplate/projectenter', {
            ...data
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ENTER_PAY(data) {
    return new Promise((resolve, reject) => {
        POST('/shoptemplate/projectenter/pay', {
            ...data
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function ENTER_PAY_RESULT(pay_no) {
    return new Promise((resolve, reject) => {
        GET(`/shoptemplate/projectenter/pay/${pay_no}`, {
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

function PROJECT_UPDATE(id ,data) {
    return new Promise((resolve, reject) => {
        PUT(`/shoptemplate/project/${id}`, {
            ...data
        }, res=> {
            resolve(res)
        }, error => {
            reject(error)
        });
    });
}

export default {
    IMAGE_UPLOAD_URL: `${API_HOST}/shoptemplate/imageupload`,
    LOGIN,
    PROJECT_LIST,
    PROJECT_MONEY,
    PROJECT_INFO,
    HOME_BANNERS,
    HOME_GOODS,
    HOME_CATEGORYS,
    GOODS_INFO,
    ORDER_CREATE,
    ORDER_INFO,
    ORDER_CHECK,
    ORDER_LIST,
    ORDER_DELETE,
    ORDER_REPAY,
    ORDER_FINISH,
    ORDER_SEND,
    ORDER_CANCEL,
    WITHDRAW,
    UPDATE_USER_INFO,
    GET_USER_INFO,
    ENTER,
    ENTER_PAY,
    ENTER_PAY_RESULT,
    PROJECT_UPDATE
}