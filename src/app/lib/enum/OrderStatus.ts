function isThisType(val) {
  for (let key in this) {
    if (this[key] == val) {
      return true
    }
  }
  return false
}

const OrderStatus = {
  // 待支付
  UNPAID: 1,
  // 已支付
  PAID: 2,
  // 已发货
  DELIVERED: 3,
  // 已支付，但库存不足
  PAID_BUT_OUT_OF: 4,
  // 支付超时
  PAY_TIMEOUT: 5,
  // 已完成
  FINISHED: 6,
  // 已取消
  CANCELED: 10,
  isThisType
}

export default OrderStatus