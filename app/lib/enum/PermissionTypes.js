
function isThisType(val) {
  for (let key in this) {
    if (this[key] == val) {
      return true
    }
  }
  return false
}

const PermissonType = {
  DATA_SELF: 1, // 仅看自己的数据
  DATA_: 101,  // 下属
  WECHAT_H5_PAY: 102, // 所有下属
  WECHAT_JSAPI_PAY:103, // 微信jsapi支付
  DATA_BUSINUESS: 200, // 组织
  DATA_ORGNIZATION: 201, // 部门
  DATA_GROUP: 202, // 小组
  DATA_TEAM: 203, // 团队
  isThisType
}

module.exports = PermissonType