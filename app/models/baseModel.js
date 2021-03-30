const {
  Sequelize,
  Model,
  DataTypes,
  BuildOptions,
  Op
} = require('sequelize')

const {
  getPaginationList,
  addData,
  deleteById,
  updateData,
  getData,
  getAll
} = require('./EntityUtil')

const {
  sequelize
} = require('../../core/db')

function getLastPage(total, size) {
  let last = 0
  let tmp = total % size
  let tmp2 = ~~(total / size)
  last = tmp == 0 ? tmp2 : tmp2 + 1
  return last
}

const base_attrs = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    comment: '名称',
    allowNull: false
  },
  remark: {
    type: DataTypes.STRING,
    comment: '说明',
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '用户状态，0可用，1禁用'
  },
  code: {
    type: DataTypes.STRING,
    comment: '编码'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue:9999,
    comment: '顺序'
  },
  owner: {
    type: DataTypes.INTEGER,
    comment: '拥有人'
  },
  owner_name: {
    type: DataTypes.STRING,
    comment: '拥有人名称'
  },
  orginazation: {
    type: DataTypes.INTEGER,
    comment: '组织'
  },
  orginazation_name: {
    type: DataTypes.STRING,
    comment: '组织名称'
  },
  business: {
    type: DataTypes.INTEGER,
    comment: '部门'
  },
  business_name: {
    type: DataTypes.STRING,
    comment: '部门名称'
  }
}

class BaseModel extends Model {
  static async addData(params) {
    return await addData(params, this)
  }

  static async getPagination(params, where, options = {}) {
    return await getPaginationList(params, this, where, options)
  }

  static async getAll(where,options={}) {
    return await getAll(where, this, options)
  }

  static async getData(id) {
    return await getData(id, this)
  }

  static async updateData(data) {
    return await updateData(data, this)
  }

  static async deleteById(id) {
    return await deleteById(id, this)
  }

  static initModel(models, args) {
    args.sequelize = sequelize
    this.init({
        ...base_attrs,
        ...models
      },
      args
    )
  }
}

module.exports = {
  Sequelize,
  sequelize,
  Model,
  DataTypes,
  BuildOptions,
  BaseModel,
  Op,
  getLastPage,
  getPaginationList
}