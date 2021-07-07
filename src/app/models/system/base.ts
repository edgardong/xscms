// const {
//   DataTypes,
//   BaseModel
// } = require('../baseModel')

// const config = require('../../../config/config.json')

// const Entitys = {}

// config.models.forEach(function (m) {
//   class Base extends BaseModel {}
//   let tableName = (m.prefix || config.prefix) + m.name

//   let attrs = {}
//   let keys = Object.keys(m.attrs)
//   keys.forEach(function (k) {
//     let v = m.attrs[k]
//     attrs[k] = {
//       type: DataTypes[v.type],
//       allowNull: !v.required,
//       comment: v.comment,
//     }
//     if (v.defaultValue !== undefined && v.defaultValue != null) {
//       attrs[k].defaultValue = v.defaultValue
//     }
//   })

//   Base.initModel({
//     ...attrs
//   }, {
//     tableName,
//     comment: m.comment
//   })



//   // "relations": [{
//   //   "type": "hasMany",
//   //   "content": {
//   //     "className": "Department",
//   //     "options": {
//   //       "foreignKey": "pid",
//   //       "targetKey": "id",
//   //       "as": "children"
//   //     }
//   //   }
//   // }],

//   // Menu.hasMany(Menu, {
//   //   foreignKey: 'pid',
//   //   targetKey: 'id',
//   //   as: 'children'
//   // })

//   // Base.sync({
//   //   force: true
//   // }).then(result => {
//   //   console.log('执行结果', result)
//   // })

//   if (m.relations && m.relations.length > 0) {
//     m.relations.forEach(rl => {
//       Base[rl.type](Base, rl.content.options)
//     })
//   }

//   // if(m.name=='department'){
//   //   console.log('here', m.name)

//   // }

//   Entitys[m.name] = Base
// })


// module.exports = Entitys
