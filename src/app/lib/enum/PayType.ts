
function isThisType(val) {
  for (let key in this) {
    if (this[key] == val) {
      return true
    }
  }
  return false
}

const PayType = {
  WECHAT_MINI_PAY: 100, // 微信小程序支付
  WECHAT_APP_PAY: 101,  // 微信app支付
  WECHAT_H5_PAY: 102, // 微信h5支付
  WECHAT_JSAPI_PAY:103, // 微信jsapi支付
  ALIPAY_MINI_PAY: 200, // 支付宝小程序支付
  ALIPAY_APP_PAY: 201, // 支付宝app支付
  ALIPAY_WEB_MOBILE_PAY: 202, // 支付宝webapp支付
  ALIPAY_WEB_PC_PAY: 203, // 支付宝pc支付
  isThisType
}

export default PayType