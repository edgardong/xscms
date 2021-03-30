function getLastPage(total, size) {
  let last = 0
  let tmp = total % size
  let tmp2 = ~~(total / size)
  last = tmp == 0 ? tmp2 : tmp2 + 1
  return last
}

/**
 * 获取分页列表
 * @param {*} Entity 实体对象
 * @param {*} params 需要参数
 * @param {object} where 限制条件
 */
async function getPaginationList(params, Entity, where = {}, options = {}) {
  let result = {
    data: [],
    total: 0,
    per_page: params.size,
    current_page: params.page,
    last_page: 0
  }

  let query = {
    limit: params.size,
    offset: (params.page - 1) * params.size,
    order: [
      params.order ? [...params.order] : ['create_time', 'desc']
    ],
    where: {
      status: 0,
      ...where
    },
    ...options
  }
  if (options.include) {
    query.distinct = true
  }

  const menus = await Entity.findAndCountAll(query)

  result.data = menus.rows
  result.total = menus.count
  result.last_page = getLastPage(result.total, result.per_page)

  return result
}


async function deleteById(id, Entity) {
  let result = await Entity.update({
    status: 1
  }, {
    where: {
      id
    }
  })
  if (result) {
    return '删除成功'
  }
  return '删除失败'
}

/**
 * 添加一个用户
 * @param {object} data 用户对象
 */
async function addData(data, Entity) {
  return await Entity.create({
    ...data
  })
}


/**
 * 更新表单信息
 * @param {*} data
 */
async function updateData(data, Entity) {
  Entity.update(
    data, {
      where: {
        status: 0,
        id: data.id
      }
    }).then(resp => {
    // console.log('怎么了？', resp)
  }).catch(err => {
    console.log('出错了', err)
  })

  // console.log(obj)

  // return obj
}

/**
 * 根据id获取数据
 * @param {*} id
 */
async function getData(id, Entity) {
  return await Entity.findOne({
    where: {
      id
    }
  })
}

async function getAll(where, Entity, options = {}) {
  return await Entity.findAll({
    order: [
      options.order ? options.order.split('_') : ['create_time', 'desc']
    ],
    where: {
      status: 0,
      ...where
    }
  })
}

module.exports = {
  getPaginationList,
  addData,
  updateData,
  deleteById,
  getData,
  getAll
}