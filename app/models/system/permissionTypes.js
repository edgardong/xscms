// 1，仅自己；2，直属下属；3，所有下属；4，部门；5，团队；6，组织；7，小组；
const DATAPERMISSIONS = [{
  id: 1,
  text: '自己',
  comment: '只能查看自己的数据'
}, {
  id: 2,
  text: '下属',
  comment: '可以查看自己和直系下属的数据'
}, {
  id: 3,
  text: '所有下属',
  comment: '可以查看自己和所有下属的数据'
}, {
  id: 4,
  text: '部门',
  comment: '可以查看自己和所在部门人员的数据'
}, {
  id: 5,
  text: '团队',
  comment: '可以查看自己和所在团队人员的数据'
}, {
  id: 6,
  text: '组织',
  comment: '可以查看自己和所在组织的人员的数据'
}, {
  id: 7,
  text: '小组',
  comment: '可以查看自己和所在小组人员的数据'
}]

module.exports = DATAPERMISSIONS