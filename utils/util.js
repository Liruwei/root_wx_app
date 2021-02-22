const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatGoodsInfo = (o, isDetal=false) => {
  o.photos = (o.photos || '').split(',')
  o.showPrice = o.is_discounts === 1 ? (o.discounts_price / 100).toFixed(2) : (o.price / 100).toFixed(2)
  o.oldPrice = (o.price / 100).toFixed(2)
  if (!isDetal) {
    return {
      id: o.id,
      name: o.name,
      photos: [o.photos[0]],
      showPrice: o.showPrice,
      unit: o.unit
    }
  }
  return o
}

const formatOrderInfo = (item) => {
  let products = []
  if (item.products) {
    try {
      products = JSON.parse(item.products).map(o => ({
        name: o.name,
        showPrice: o.is_discounts ? (o.discounts_price / 100).toFixed(2) : (o.price / 100).toFixed(2),
        photo: o.photo,
        num: o.num
      }))
    } catch(e) {}
  }
  let send_money = 0
  if (item.send_money) {
    send_money = 1 * ((item.send_money || 0) / 100).toFixed(2)
  }
  return {
    ...item,
    pay_time: item.pay_time ? (new Date(1 * item.pay_time)).toLocaleString() : null,
    create_time: item.create_time ? (new Date(1 * item.create_time)).toLocaleString() : null,
    update_time: item.update_time ? (new Date(1 * item.update_time)).toLocaleString() : null,
    money: (item.money / 100).toFixed(2),
    products: products,
    send_money: send_money
  }
}

module.exports = {
  formatTime: formatTime,
  formatGoodsInfo,
  formatOrderInfo
}
