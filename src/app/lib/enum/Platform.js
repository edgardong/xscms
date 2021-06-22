function isThisType(val) {
  for (let key in this) {
    if (this[key] == val) {
      return true
    }
  }
  return false
}

const Platform = {
  MINI_PROGRAM: 100,
  APP: 101,
  MOBILE_WEB: 102,
  PC_WEB: 200,
  ADMIN_WEB: 201,
  BLOG_WEB: 202,
  OFFICIAL_WEB: 203,
  isThisType
}

module.exports = Platform