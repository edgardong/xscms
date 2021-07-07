// const { DataTypes, Op, sequelize, BaseModel } = require('../baseModel')

// const User = require('../user')
// const RoleMenu = require('./roleMenu')

// class Menu extends BaseModel {
//   static async getTreeData() {
//     let where = {
//       status: 0,
//       pid: null,
//     }
//     const result = await Menu.findAll({
//       where,
//       order: [['order'], ['create_time', 'desc']],
//       attributes: [
//         ['id', 'key'],
//         ['name', 'title'],
//       ],
//       include: [
//         {
//           model: Menu,
//           as: 'children',
//           attributes: [
//             ['id', 'key'],
//             ['name', 'title'],
//           ],
//         },
//       ],
//     })

//     return result
//   }

//   static async getMenuByRole() {}

//   /**
//    * 根据权限获取用户菜单
//    * @param {*} params
//    * @param {*} auth 认证信息
//    * @returns
//    */
//   static async getAll(params, auth) {
//     let type = params.type
//     let { uid, socpe } = auth
//     let user = await User.findOne({
//       where: {
//         status: 0,
//         id: uid,
//       },
//     })
//     // id: {
//     //   [opIn]: artIds,
//     // },
//     let where = {}
//     if (user.usertype != 99) {
//       let roles = JSON.parse(user.roles).map((r) => r.key)
//       let menuIds = await RoleMenu.findAll({
//         where: {
//           role: {
//             [Op.in]: roles,
//           },
//         },
//       })

//       where = {
//         status: 0,
//         id: {
//           [Op.in]: menuIds.map((m) => m.menu),
//         },
//       }
//     } else {
//       where = {
//         status: 0,
//       }
//     }

//     if (type == 1) {
//       where.pid = null
//     }
//     const result = await Menu.findAll({
//       where,
//       order: [['order'], ['create_time', 'desc']],
//       include: [
//         {
//           model: Menu,
//           as: 'children',
//         },
//       ],
//     })

//     return result
//   }
// }

// Menu.initModel(
//   {


// Menu.hasMany(Menu, {
//   foreignKey: 'pid',
//   targetKey: 'id',
//   as: 'children',
// })

// module.exports = Menu
