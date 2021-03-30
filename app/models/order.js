const {
  Sequelize,
  Model,
  sequelize,
  getLastPage,
  DataTypes,
  Op
} = require('./baseModel')

const OrderService = require('../services/order')
const {
  UserAddress
} = require('./userAddress')
const {
  Product
} = require('./product')
const {
  User
} = require('./user')

class Order extends Model {

  /**
   * 分页获取用户的订单
   * @param {Integer} user_id 用户id
   * @param {Integer} page 当前页
   * @param {Integer} limit 每个页面显示的数据量
   */
  static async getUserOrders(user_id, page, limit = 15) {
    // console.log(user_id, page, limit)
    const orders = Order.findAll({
      where: {
        user_id
      },
      limit,
      offset: (page - 1) * limit
    })

    return orders
  }

  /**
   * 分页获取订单列表
   * @param {*} params 参数集合
   */
  static async getPaginationOrders(params) {
    let result = {
      data: [],
      total: 0,
      per_page: params.size,
      current_page: params.page,
      last_page: 0
    }

    const products = await Order.findAndCountAll({
      limit: params.size,
      offset: (params.page - 1) * params.size,
      order: [
        ['create_time', 'desc']
      ]
    })

    result.data = products.rows
    result.total = products.count
    result.last_page = getLastPage(result.total, result.per_page)

    return result
  }

  /**
   * 下单操作
   * @param {Integer} userid 用户id
   * @param {Array} products 下单的产品
   */
  static async placeOrder(userId, products) {
    const proIds = products.map(p => p.product_id)
    const result = await this.checkStockByIds(proIds, products)
    if (result.pass) {
      // 生成订单快照
      return await this.snapOrder(userId, result.data)
    }
  }

  static async checkStockByIds(ids, products, needDbStock) {
    // 获取数据库中的对应产品集合
    const dbProducts = await Product.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })

    // 核对库存
    const result = this.checkDbStock(products, dbProducts, needDbStock)
    return result
  }

  /**
   * 生成订单快照并返回订单信息
   * @param {*} userId 用户Id
   * @param {*} data 订单数据
   */
  static async snapOrder(userId, data) {
    const address = await UserAddress.findOne({
      where: {
        user_id: userId
      }
    })
    if (!address) {
      throw new Error('用户地址不存在,无法下单')
    }
    const user = await User.findOne({
      where: {
        id: userId
      }
    })
    let order_no = this.makeOrderNo()
    let snap = {
      total_price: data.totalPrice,
      total_count: data.totalCount,
      snap_items: JSON.stringify(data.products),
      snap_address: JSON.stringify(address),
      snap_name: data.products[0].name,
      snap_img: data.products[0].main_img_url,
      order_no: order_no,
      user_id: userId,
      open_id: user.openid
    };
    if (data.products.length > 1) {
      snap.snap_name += '等'
    }

    let result = await Order.create(snap)

    return {
      order_no,
      order_id: result.id,
      create_time: result.create_time,
      pass: true
    }

  }

  /**
   * 创建订单编号
   * @return string
   */
  static makeOrderNo() {
    const yCode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    //   根据当前时间和随机数生成流水号
    const now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    return yCode[(year - 2019) % yCode.length] + year.toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 89 + 100)).toString()
  }

  /**
   * 核对下单是否符合条件
   * @param {Array} products 客户端下单的数据
   * @param {Array} dbProducts 数据库中的数据
   * @param {Boolean}  needDbStock 是否需要返回数据库中的库存
   */
  static checkDbStock(products, dbProducts, needDbStock) {
    let result = {
      pass: true,
      data: {
        products: [],
        totalCount: 0,
        totalPrice: 0
      }
    }
    products.forEach(pro => {
      let pid = pro.id || pro.product_id
      // 单品状态
      let singleStatus = {
        id: pid,
        hasStock: false,
        counts: pro.count,
        price: 0,
        name: '',
        totalPrice: 0,
        main_img_url: ''
      }

      let dbPro = dbProducts.filter(dbp => dbp.id === pid)[0]
      if (dbPro) {
        // 库存不足
        if (dbPro.stock < pro.count) {
          result.pass = false
          if (!needDbStock) {
            throw new Error('商品库存不足')
          }
          singleStatus.hasStock = false
          console.log('商品库存不足')
        } else {
          singleStatus.hasStock = true
        }

        singleStatus.price = dbPro.price
        singleStatus.name = dbPro.name
        singleStatus.main_img_url = dbPro.main_img_url
        singleStatus.totalPrice = pro.count * dbPro.price
        if (needDbStock) {
          singleStatus['dbStock'] = dbPro.stock
        }

        // 整个订单数据处理
        result.data.totalCount += pro.count
        result.data.totalPrice += singleStatus.totalPrice
        result.data.products.push(singleStatus)

      } else {
        // 没有找到产品
        result.pass = false
        if (!needDbStock) {
          throw new Error('商品库存不足')
        }
        console.log('商品库存不足')
      }
    })

    return result
  }
}

Order.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键'
  },
  order_no: {
    type: Sequelize.STRING(20),
    comment: '订单号'
  },
  user_id: {
    type: Sequelize.STRING(32),
    comment: '外键，用户ID'
  },
  total_price: {
    type: Sequelize.DECIMAL(6, 2),
    comment: '订单总金额'
  },
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    comment: '订单状态 1:未支付，2:已支付，3:已发货，4:已支付，但库存不足'
  },
  snap_img: {
    type: Sequelize.STRING(255),
    comment: '订单快照图片'
  },
  snap_name: {
    type: Sequelize.STRING(80),
    comment: '订单快照名称'
  },
  total_count: {
    type: Sequelize.INTEGER,
    comment: '订单总数量'
  },
  snap_items: {
    type: Sequelize.TEXT,
    comment: '订单其他快照信息，json形式'
  },
  snap_address: {
    type: Sequelize.STRING(500),
    comment: '地址快照'
  },
  prepay_id: {
    type: Sequelize.STRING(100),
    comment: '支付与订单ID'
  },
  type: {
    type: Sequelize.INTEGER,
    comment: '订单类型 1：支付宝APP, 2:支付宝WEB，3:微信APP，4:微信WEB, 5:微信小程序'
  },
  open_id: {
    type: DataTypes.STRING,
    comment: '用户openid'
  }
}, {
  sequelize,
  tableName: 'xs_order'
})

module.exports = {
  Order
}