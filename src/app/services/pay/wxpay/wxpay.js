const axios = require('axios')
const {
  randomString
} = require('../../../../core/util')
const util = require('./util')

class WxPay {
  constructor() {
    this.unifiedOrderUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder'

    this.appid = '' // 小程序id
    this.mch_id = '' // 商户号id
  }


  /**
   * 统一支付
   * @param {*} data
   */
  static async unifiedOrder(order) {
    let appid = global.config.miniProgram.appid
    let mch_id = global.config.pay.wechat.mch_id
    let mchkey = global.config.pay.wechat.mch_key
    let nonce_str = util.createNonceStr();
    let timestamp = util.createTimeStamp();
    let trade_type = 'JSAPI'
    let body = '测试微信支付';
    let out_trade_no = order.order_no;
    let total_fee = util.getmoney(order.total_price);
    let notify_url = global.config.pay.wechat.notify_url
    let openid = order.open_id
    let signType = 'MD5'

    let sign = util.paysignjsapi(appid, openid, body, mch_id, nonce_str, notify_url, out_trade_no, total_fee, trade_type, mchkey);
    // console.log('sign==', sign);

    //组装xml数据
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>"; //appid
    formData += "<body><![CDATA[" + body + "]]></body>";
    formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>" + trade_type + "</trade_type>";
    formData += "<sign>" + sign + "</sign>";
    formData += '<openid>' + openid + '</openid>'
    formData += "</xml>";
    // console.log('formData===', formData);

    let unifiedOrderUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
    let result = await axios.post(unifiedOrderUrl, formData)
    // console.log(result.data)
    let prepay_id = await util.getXMLNodeValue(result.data)
    // console.log(prepay_id)
    let paySign = util.paysignjsapifinal(appid, mch_id, prepay_id, nonce_str, timestamp, mchkey, signType)

    return {
      nonceStr: nonce_str,
      package: "prepay_id=" + prepay_id,
      paySign,
      signType,
      timeStamp: timestamp
    }
  }


}


module.exports = WxPay