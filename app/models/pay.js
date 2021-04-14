const Order = require('./order')
const { sequelize } = require('./baseModel')
const Product = require('./product')
const { OrderStatus, PayType } = require('../lib/enum')
const WxPush = require('../services/push/wxpush')
const WxPay = require('../services/pay/wxpay/wxpay')

class Pay {
  static async preOrder(params) {
    let payType = params.payType
    const order = await Order.findOne({
      where: {
        id: params.id,
      },
    })
    if (!order) {
      throw new Error('订单数据不存在')
    }
    order.snap_items = JSON.parse(order.snap_items)

    const ids = order.snap_items.map((item) => item.id)
    const result = await Order.checkStockByIds(ids, order.snap_items)
    if (result.pass) {
      let data = null
      if (payType === PayType.WECHAT_MINI_PAY) {
        data = await WxPay.unifiedOrder(order)
      }
      // 回写订单预支付id
      const prepay_id = data.package.replace('prepay_id=', '')
      Order.update(
        {
          prepay_id,
        },
        {
          where: {
            id: order.id,
          },
        }
      )
      return data
    }
  }

  /**
   * 订单支付成功后的返回数据
   * @param {Object} data 成功后的返回数据
   */
  static async paySuccess(data) {
    // const return_code = await getXMLNodeValueByKey(data, 'return_code')
    const return_code = data.return_code[0]
    // const out_trade_no = await getXMLNodeValueByKey(data, 'out_trade_no')
    const out_trade_no = data.out_trade_no[0]
    if (return_code === 'SUCCESS') {
      const order = await Order.findOne({
        where: {
          order_no: out_trade_no,
        },
      })
      if (!order) {
        throw new Error('订单数据不存在')
      }
      order.snap_items = JSON.parse(order.snap_items)
      const ids = order.snap_items.map((item) => item.id)
      let result = await Order.checkStockByIds(ids, order.snap_items, true)
      // 订单状态
      let orderStatus = OrderStatus.PAID
      if (!result.pass) {
        orderStatus = OrderStatus.PAID_BUT_OUT_OF
      }

      let records = order.snap_items.map((item) => {
        let dbRecord = result.data.products.find((i) => i.id == item.id)
        return {
          id: item.id,
          stock: dbRecord.dbStock - item.counts,
        }
      })
      // console.log(order)
      // 推送微信消息
      const pushData = {
        openid: order.open_id,
        prepay_id: order.prepay_id,
        snap_name: order.snap_name,
        total_price: order.total_price,
        create_time: order.create_time,
        order_no: order.order_no,
        id: order.id,
      }
      // 推送微信消息
      WxPush.sendPayMessage(pushData)

      sequelize.transaction((t) => {
        return Promise.all([
          // 更新订单状态
          Order.update(
            {
              status: orderStatus,
            },
            {
              where: {
                id: order.id,
              },
              transaction: t,
            }
          ),

          // 减少库存
          Product.bulkCreate(records, {
            updateOnDuplicate: ['stock'],
            transaction: t,
          }),
        ])
      })
    } else {
      let orderStatus = OrderStatus.UNPAID
      // 修改订单状态为未支付
      Order.update(
        {
          status: orderStatus,
        },
        {
          where: {
            order_no: out_trade_no,
          },
        }
      )
    }
  }
}

module.exports = Pay
