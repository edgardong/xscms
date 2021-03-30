const axios = require('axios')
const WxManager = require('../../wx')

class WxPush {
  static async sendPayMessage(data) {
    const access_token = await WxManager.getAccessToken(global.config.miniProgram.appid, global.config.miniProgram.appSecret)
    const url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token

    const pushData = {
      touser: data.openid,
      template_id: 'zwSFsaLOessa72LvPqdM9P-pG7APhYmVcCL-QvahcnE',
      form_id: data.prepay_id,
      page: 'pages/order/order?id=' + data.id,
      data: {
        keyword1: {
          // 订单编号 {{keyword1.DATA}}
          value: data.order_no
        },
        keyword2: {
          // 商品名称 {{keyword2.DATA}}
          value: data.snap_name
        },
        keyword3: {
          // 支付金额 {{keyword3.DATA}}
          value: data.total_price
        },
        keyword4: {
          // 下单时间 {{keyword4.DATA}}
          value: data.create_time
        },
        keyword5: {
          // 订单金额 {{keyword5.DATA}}
          value: data.total_price
        },
        keyword6: {
          // 订单状态 {{keyword6.DATA}}
          value: '已支付'
        },
        keyword7: {
          // 支付方式 {{keyword7.DATA}}
          value: '微信支付'
        }
      }
    }
    console.log('推送的数据', url, pushData)
    setTimeout(async () => {
      // https://developers.weixin.qq.com/community/develop/doc/000a827d720098fe17f87239a53400
      // 延时原因
      const result = await axios.post(url, pushData)
      console.log('消息推送返回值: ', result.data)
      // { errcode: 0, errmsg: 'ok' }
    }, 20000)
  }

}

module.exports = WxPush