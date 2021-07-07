function isThisType(this: { USER_MINI_PROGRAM: number; USER_EMAIL: number; USER_MOBILE: number; ADMIN_EMAIL: number; ADMIN_USERNAME: number; USER_USERNAME: number; isThisType: (val: any) => boolean }, val: any) {
  for (let key in this) {
    if (this[key] == val) {
      return true
    }
  }
  return false
}

const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 200,
  ADMIN_USERNAME: 201,
  USER_USERNAME: 103,
  isThisType: isThisType
}

export default LoginType