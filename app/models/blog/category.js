const { sequelize, DataTypes, BaseModel } = require('../baseModel')

class Category extends BaseModel {
  static async getTreeData() {
    let where = {
      status: 0,
      parent: null,
    }
    const result = await Category.findAll({
      where,
      order: [['order'], ['create_time', 'desc']],
      attributes: [
        ['id', 'key'],
        ['name', 'title'],
      ],
      include: [
        {
          model: Category,
          as: 'children',
          attributes: [
            ['id', 'key'],
            ['name', 'title'],
          ],
        },
      ],
    })

    return result
  }

  static async getShowData() {
    let where = {
      status: 0,
      parent: null,
      show: 1,
    }
    const result = await Category.findAll({
      where,
      order: [['order'], ['create_time', 'desc']],
      attributes: [
        ['id', 'key'],
        ['name', 'title'],
      ],
      include: [
        {
          model: Category,
          as: 'children',
          attributes: [
            ['id', 'key'],
            ['name', 'title'],
          ],
        },
      ],
    })

    return result
  }

  static async getAllCategory() {
    const result = await Category.findAll({
      where: {
        status: 0,
        parent: null,
      },
      include: [
        {
          model: Category,
          as: 'children',
        },
      ],
    })

    return result
  }
}

Category.initModel(
  {
    id: {
      type: DataTypes.INTEGER,
      comment: '主键',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      comment: '分类名称',
    },
    order: {
      type: DataTypes.INTEGER,
      comment: '分类排序',
    },
    key: {
      type: DataTypes.STRING,
      comment: '分类关键字',
    },
    show: {
      type: DataTypes.BOOLEAN,
      comment: '是否在菜单栏显示',
    },
    type: {
      type: DataTypes.INTEGER,
      comment: '分类类型 1:栏目， 2:频道，3:链接 4:单页',
    },
    parent: {
      type: DataTypes.INTEGER,
      comment: '父级分类',
    },
    status: {
      type: DataTypes.INTEGER,
      comment: '分类状态',
      defaultValue: 0,
    },
  },
  {
    tableName: 'xs_post_category',
    comment: '文章分类',
  }
)

Category.sync({
  alter: true,
})

Category.hasMany(Category, {
  foreignKey: 'parent',
  targetKey: 'id',
  as: 'children',
})

module.exports = Category
