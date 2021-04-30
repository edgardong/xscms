const { Sequelize, BaseModel, DataTypes } = require('../baseModel')
const BtrorderGoods = require('./order_goods')
const BtrorderProject = require('./order_project')

const Btrmember = require('./member')

class Btrorder extends BaseModel {
  static async addOrder(data) {
    let totalPrice = data.projects.reduce(
      (preValue, current) => Number(preValue) + Number(current.price),
      0
    )
    totalPrice = data.goods.reduce(
      (preValue, current) => Number(preValue) + Number(current.price),
      totalPrice
    )

    let snapshot = JSON.stringify({
      goods: data.goods,
      projects: data.projects,
    })

    const orderForm = {
      name: new Date().getTime(),
      price: totalPrice,
      member: data.member,
      snapshot: snapshot,
    }

    let order = await Btrorder.create(orderForm)

    // 修改用户的余额
   await Btrmember.findByPk(data.member).then(member=>{
    return member.decrement('price',{by: totalPrice})
   })


    let goodResult = await BtrorderGoods.bulkCreate(
      data.goods.map((g) => ({ order: order.id, ...g }))
    )
    let projectResult = await BtrorderProject.bulkCreate(
      data.projects.map((g) => ({ order: order.id, ...g }))
    )

    return {
      order,
      goodResult,
      projectResult,
    }
  }
}

Btrorder.initModel(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    name: {
      type: DataTypes.STRING,
      comment: '订单名称',
    },
    picture: {
      type: DataTypes.STRING,
      comment: '项目图片',
    },
    snapshot: {
      type: DataTypes.STRING,
      comment: '订单快照信息',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '项目类型 1:普通用户，2:年会员，3:终身会员',
    },
    price: {
      type: DataTypes.DOUBLE,
      comment: '项目金额',
    },
    member: {
      type: DataTypes.INTEGER,
      comment: '项目使用者',
    },
  },
  {
    tableName: 'xs_btr_order',
    comment: '巴图尔会员订单',
  }
)

module.exports = Btrorder
