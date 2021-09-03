// const {
//   sequelize,
//   DataTypes,
//   BaseModel
// } = require('../baseModel')

// class Tag extends BaseModel {

//   /**
//    * 保存tag及文章的关系
//    * @param {object} data 需要保存的数据
//    */
//   static async saveTag(data) {

//   }

//   static async getAllTag() {
//     const result = await Tag.findAll({
//       where: {
//         status: 0
//       }
//     })
//     return result
//   }
// }

// Tag.initModel({
//   order: {
//     type: DataTypes.INTEGER,
//     comment: '标签排序'
//   },
//   count: {
//     type: DataTypes.INTEGER,
//     comment: '标签使用次数'
//   },
//   articles: {
//     type: DataTypes.STRING,
//     comment: '使用这个tag的文章'
//   }
// }, {
//   tableName: 'xs_tag',
//   comment: '标签',
// })

// export default Tag