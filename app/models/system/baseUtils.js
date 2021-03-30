const config = require('../../../config/config.json')

const {
  Entitys
} = require('./base')


async function getTree(Model) {
  return await Model.findAll({
    where: {
      status: 0
    },
    order: [
      ['order'],
      ['create_time', 'desc']
    ],
    attributes: [
      ['id', 'value'],
      ['name', 'title']
    ],
    include: [{
      model: Model,
      as: 'children',
      attributes: [
        ['id', 'value'],
        ['name', 'title']
      ],
    }, ]
  })
}

/**
 * 实体的名称
 */
async function getEntityColumns(name) {
  const entity = Entitys[name]

  let model = config.models.find(m => m.name == name)

  let baseItems = [{
    hidden: true,
    type: 'text',
    label: '主键',
    key: 'id',
    value: '',
    required: false,
    rules: []
  }, {
    type: 'text',
    label: '编码',
    key: 'code',
    value: '',
    required: true,
    rules: []
  }, {
    type: 'text',
    label: '名称',
    key: 'name',
    value: '',
    required: true,
    rules: []
  }, ]

  let baseListItems = [{
    title: '名称',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '编码',
    dataIndex: 'code',
    width: 150,
  }]


  let listItems = [...baseListItems],
    editItems = [...baseItems],
    detailItems = [...baseItems]

  let keys = Object.keys(model.attrs)
  for (let k of keys) {
    // console.log(k)
    let v = model.attrs[k]
    let vv = JSON.parse(JSON.stringify(v))
    delete vv.show

    let column = {
      type: vv.data || 'text',
      label: vv.label,
      key: k,
      value: '',
      required: v.required,
      rules: []
    }
    // console.log(vv)
    let listColumn = {
      title: vv.label,
      dataIndex: k,
      width: vv.listWidth || 150,
      ellipsis: vv.ellipsis || false
    }

    if (vv.data === 'treeselect' && vv.dataType) {
      // console.log('这个字段', k, vv)
      let En = Entitys[vv.dataType]
      // console.log(vv.data)
      column.simpleMode = vv.simpleMode
      let treeData = await getTree(En)
      column.treeData = treeData
      // console.log('这一列', column)
    }
    if (vv.data = 'select' && vv.dataOptions) {
      column.options = vv.dataOptions
      listColumn.renderOptions = vv.dataOptions
    }

    if (v.show && v.show.indexOf('list') > -1) {
      // console.log(k)
      let item = listItems.find(li => li && li.dataIndex == k)
      if (item && listColumn) {
        // console.log('item.....', item)
        // console.log('listColumn.....', listColumn)
        item = Object.assign(item, listColumn)
      } else {
        listItems.push(listColumn)
      }
    }
    if (v.show && v.show.indexOf('edit') > -1) {
      let item = editItems.find(li => li && li.key == k)
      if (item && column) {
        item = Object.assign(
          item,
          column
        )
      } else {
        editItems.push(column)
      }
    }
    if (v.show && v.show.indexOf('detail') > -1) {
      let item = detailItems.find(li => li && li.key == k)
      if (item && column) {
        item = Object.assign(
          item,
          column
        )
      } else {
        detailItems.push(column)
      }
    }
  }

  return {
    list: listItems,
    edit: editItems,
    detail: detailItems
  }
}

module.exports = {
  getEntityColumns
}