// const { Sequelize } = require('sequelize')
// const Op = Sequelize.Op

/**
 * 获取最后一页数字
 * @param total 总数
 * @param size 分页大小
 * @returns 最后一页数字
 */
function getLastPage(total: number, size: number) {
  let last = 0
  let tmp = total % size
  let tmp2 = ~~(total / size)
  last = tmp == 0 ? tmp2 : tmp2 + 1
  return last
}

// /**
//  * 获取分页列表
//  * @param {*} Entity 实体对象
//  * @param {*} params 需要参数
//  * @param {object} where 限制条件
//  */
// async function getPaginationList(params, Entity, where = {}, options = {}) {
//   let result = {
//     data: [],
//     total: 0,
//     per_page: params.size,
//     current_page: params.page,
//     last_page: 0,
//   }

//   // like,=,<,>,<=,>=,

//   // if (params.name) {
//   //   where.name = {
//   //     [Op.like]: `%${params.name}%`,
//   //   }
//   // }
//   // if (params.mobile) {
//   //   where.mobile = {
//   //     [Op.eq]: `${params.mobile}`,
//   //   }
//   // }

//   let query = {
//     limit: params.size,
//     offset: (params.page - 1) * params.size,
//     order: [params.order ? [...params.order] : ['create_time', 'desc']],
//     where: {
//       status: 0,
//       ...where,
//     },
//     ...options,
//   }
//   // if (options.include) {
//   //   query.distinct = true
//   // }

//   const menus = await Entity.findAndCountAll(query)

//   result.data = menus.rows
//   result.total = menus.count
//   result.last_page = getLastPage(result.total, result.per_page)

//   return result
// }

// /**
//  * 根据ID删除某条数据
//  * @param id 主键
//  * @param Entity 实体名称
//  * @returns 删除结果
//  */
// async function deleteById(id, Entity) {
//   let result = await Entity.update(
//     {
//       status: 1,
//     },
//     {
//       where: {
//         id,
//       },
//     }
//   )
//   if (result) {
//     return '删除成功'
//   }
//   return '删除失败'
// }

// /**
//  * 添加一条数据
//  * @param {object} data 需要添加的数据
//  */
// async function addData(data: object, Entity) {
//   const result = await Entity.create({
//     ...data,
//     status: 0,
//   })
//   return result
// }

// /**
//  * 更新表单信息
//  * @param {*} data
//  */
// async function updateData(data: any, Entity) {
//   Entity.update(data, {
//     where: {
//       status: 0,
//       id: data.id,
//     },
//   })
//     .then((resp) => {
//       // console.log('怎么了？', resp)
//     })
//     .catch((err) => {
//       console.log('出错了', err)
//     })

//   // console.log(obj)

//   // return obj
// }

// /**
//  * 根据id获取数据
//  * @param {Number} id
//  */
// async function getData(id: number, Entity) {
//   return await Entity.findOne({
//     where: {
//       id,
//     },
//   })
// }

// /**
//  * 获取所有的数据
//  * @param {*} where
//  * @param {*} Entity
//  * @param {*} options
//  * @returns
//  */
// async function getAll(where: any, Entity: any, options: any = {}) {
//   return await Entity.findAll({
//     order: [options.order ? options.order.split('_') : ['create_time', 'desc']],
//     where: {
//       status: 0,
//       ...where,
//     },
//   })
// }

// export {
//   getPaginationList,
//   addData,
//   updateData,
//   deleteById,
//   getData,
//   getAll,
// }
