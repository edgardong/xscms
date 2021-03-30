const Router = require('koa-router')
const router = new Router({
  prefix: '/api/store/v1/pay'
})

const {
  Auth
} = require('../../../../middlewares/auth')
const {
  PositiveIntegerValidator,
  PreOrderValidator
} = require('../../../validators/validator')

const Pay = require('../../../models/pay')

/**
 * 支付预订单
 */
router.post('/pre_order', new Auth().m, async (ctx, next) => {
  const params = await new PreOrderValidator().validate(ctx)
  const result = await Pay.preOrder(params)
  ctx.body = result
})

/**
 * 支付通知
 */
router.post('/notify', async (ctx, next) => {
  const data = ctx.request.body
  const result = await Pay.paySuccess(data.xml)
  ctx.type='xml'
  ctx.body = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'
})

router.post('/test', async (ctx, next) => {
  // Pay.paySuccess({
  //   return_code: 'SUCCESS',
  //   out_trade_no: 'A320669112069497'
  // })
  const {
    getXMLNodeValueByKey
  } = require('../../../services/pay/wxpay/util')
  let xmlStr = `<xml>
  <appid><![CDATA[wx2421b1c4370ec43b]]></appid>
  <attach><![CDATA[支付测试]]></attach>
  <bank_type><![CDATA[CFT]]></bank_type>
  <fee_type><![CDATA[CNY]]></fee_type>
  <is_subscribe><![CDATA[Y]]></is_subscribe>
  <mch_id><![CDATA[10000100]]></mch_id>
  <nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>
  <openid><![CDATA[oUpF8uMEb4qRXf22hE3X68TekukE]]></openid>
  <out_trade_no><![CDATA[1409811653]]></out_trade_no>
  <result_code><![CDATA[SUCCESS]]></result_code>
  <return_code><![CDATA[SUCCESS]]></return_code>
  <sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>
  <time_end><![CDATA[20140903131540]]></time_end>
  <total_fee>1</total_fee>
<coupon_fee><![CDATA[10]]></coupon_fee>
<coupon_count><![CDATA[1]]></coupon_count>
<coupon_type><![CDATA[CASH]]></coupon_type>
<coupon_id><![CDATA[10000]]></coupon_id>
<coupon_fee><![CDATA[100]]></coupon_fee>
  <trade_type><![CDATA[JSAPI]]></trade_type>
  <transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>
</xml>`
  // const xmlreader = require('xmlreader')
  // xmlreader.read(xmlStr, (err, resp) => {
  // ctx.body = resp.xml['appid'].text()
  // ctx.body = await getXMLNodeValueByKey(xmlStr, 'appid')
  // })
  ctx.type='xml'
  ctx.body = xmlStr
})

module.exports = router